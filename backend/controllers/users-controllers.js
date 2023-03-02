const { validationResult } = require("express-validator");
const NewError = require("../models/new-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../util/cloudinary");

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new NewError(errors.array()[0].msg, 422));
  }

  const { name, email, password, bio } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new NewError("Signing up failed, please try again later.", 500)
    );
  }

  if (existingUser) {
    return next(
      new NewError("User exists already, please login instead.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new NewError("Could not create user, please try again.", 500));
  }

  let imageFile;
  try {
    imageFile = await cloudinary.uploader.upload(req.file.path);
  } catch (err) {
    return next(new NewError("Could not upload image, please try again.", 500));
  }

  const createdUser = new User({
    name,
    bio,
    image: imageFile.secure_url,
    imageId: imageFile.public_id,
    email,
    password: hashedPassword,
    posts: [],
    followings: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new NewError("Signing up failed, please try again later.", 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "168h" }
    );
  } catch (err) {
    return next(
      new NewError("Signing up failed, please try again later.", 500)
    );
  }

  res.status(201).json({
    token,
    expiresIn: new Date(Date.now() + 604800000),
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new NewError(errors.array()[0].msg, 422));
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new NewError("Logging in failed, please try again later.", 500)
    );
  }

  if (!existingUser) {
    return next(
      new NewError("Invalid credentials, could not log you in.", 403)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new NewError(
        "Could not log you in, please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new NewError("Invalid credentials, could not log you in.", 403)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "168h" }
    );
  } catch (err) {
    return next(new NewError("Login failed, please try again later.", 500));
  }

  res.status(201).json({
    token,
    expiresIn: new Date(Date.now() + 604800000),
  });
};

const getOneUser = async (req, res, next) => {
  const userId = req.userId;

  let user;
  try {
    user = await User.findById(
      userId,
      "-email -password -posts -followings -__v"
    );
  } catch (err) {
    return next(
      new NewError("Fetching user failed, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new NewError("Could not find user for this id.", 404));
  }

  res.status(200).json({
    user,
  });
};

const editUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new NewError(errors.array()[0].msg, 422));
  }

  const { name, bio, oldpassword, password } = req.body;

  let user;
  try {
    user = await User.findById(req.userId, "-email -posts -followings -__v");
  } catch (err) {
    return next(
      new NewError("Fetching user failed, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new NewError("Could not find user for this id.", 404));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(oldpassword, user.password);
  } catch (err) {
    return next(
      new NewError(
        "Could not update user, please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new NewError("Invalid credentials, could not update user.", 403)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new NewError("Could not update user, please try again.", 500));
  }

  user.name = name;
  user.bio = bio;
  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    return next(
      new NewError("updating user failed, please try again later.", 500)
    );
  }

  res.status(200).json({ message: "User updated" });
};

const getProfile = async (req, res, next) => {
  const userId = req.userId;
  const profileId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(
      new NewError("Fetching user failed, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new NewError("Could not find user for this id.", 404));
  }

  const userInfo = { _id: user._id, image: user.image };

  const ids = user.followings.map((id) => id.toString());
  ids.push(userId);
  ids.push(profileId);

  let followed = false;
  const existingFollow = user.followings.filter((id) => id !== profileId);

  if (existingFollow.length > 0) {
    followed = true;
  }

  let randomUsers;
  try {
    randomUsers = await User.find({ _id: { $nin: ids } }).limit(3);
  } catch (err) {
    return next(
      new NewError("Fetching users failed, please try again later.", 500)
    );
  }

  randomUsers = randomUsers.map((user) => ({
    _id: user._id,
    name: user.name,
    bio: user.bio,
    image: user.image,
  }));

  let profile;
  try {
    profile = await User.findById(profileId).populate("followings posts");
  } catch (err) {
    return next(
      new NewError("Fetching user failed, please try again later.", 500)
    );
  }

  if (!profile) {
    return next(new NewError("Could not find user for this id.", 404));
  }

  const profileInfo = {
    followed,
    _id: profile._id,
    name: profile.name,
    bio: profile.bio,
    image: profile.image,
  };

  const profileFollowings = profile.followings
    .reverse()
    .slice(0, 3)
    .map((user) => ({
      _id: user._id,
      name: user.name,
      bio: user.bio,
      image: user.image,
    }));

  const profilePosts = profile.posts.reverse().map((post) => {
    let liked = false;

    const like = post.likedBy.filter((id) => id !== userId);

    if (like.length > 0) {
      liked = true;
    }

    return {
      _id: post._id,
      image: post.image,
      description: post.description,
      creatorId: profile._id,
      creatorName: profile.name,
      creatorImage: profile.image,
      liked,
    };
  });

  res.status(200).json({
    userInfo,
    randomUsers,
    profileInfo,
    profileFollowings,
    profilePosts,
  });
};

const follow = async (req, res, next) => {
  const userId = req.userId;
  const profileId = req.params.uid;

  if (userId === profileId) {
    return next(new NewError("You can't follow your self.", 404));
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(
      new NewError("Fetching user failed, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new NewError("Could not find user for this id.", 404));
  }

  const exist = user.followings.filter((id) => id !== profileId);

  if (exist.length > 0) {
    return next(new NewError("You are following him already.", 404));
  }

  try {
    user.followings.push(profileId);
    await user.save();
  } catch (err) {
    new NewError("Something went wrong, could not follow him.", 500);
  }

  res.status(201).json({
    message: "You are following him now.",
  });
};

const unfollow = async (req, res, next) => {
  const userId = req.userId;
  const profileId = req.params.uid;

  if (userId === profileId) {
    return next(new NewError("You can't unfollow your self.", 404));
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(
      new NewError("Fetching user failed, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new NewError("Could not find user for this id.", 404));
  }

  const exist = user.followings.filter((id) => id !== profileId);

  if (exist.length === 0) {
    return next(
      new NewError("You aren't following him so you can't unfollow him.", 404)
    );
  }

  try {
    user.followings.pull(profileId);
    await user.save();
  } catch (err) {
    new NewError("Something went wrong, could not follow him.", 500);
  }

  res.status(201).json({
    message: "You aren't following him now.",
  });
};

const search = async (req, res, next) => {
  const userName = req.params.un;

  let users;
  try {
    users = await User.find({ name: new RegExp(userName, "i") });
  } catch (err) {
    return next(
      new NewError("Fetching users failed, please try again later.", 500)
    );
  }

  users = users.map((user) => ({
    _id: user._id,
    name: user.name,
    bio: user.bio,
    image: user.image,
  }));

  res.status(200).json({ users });
};

exports.signup = signup;
exports.login = login;
exports.getOneUser = getOneUser;
exports.editUser = editUser;
exports.follow = follow;
exports.unfollow = unfollow;
exports.getProfile = getProfile;
exports.search = search;
