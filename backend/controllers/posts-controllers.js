const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const NewError = require("../models/new-error");
const Post = require("../models/post");
const User = require("../models/user");
const cloudinary = require("../util/cloudinary");

const createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new NewError(errors.array()[0].msg, 422));
  }

  const { description } = req.body;

  let imageFile;
  try {
    imageFile = await cloudinary.uploader.upload(req.file.path);
  } catch (err) {
    return next(new NewError("Could not upload image, please try again.", 500));
  }

  const createdPost = new Post({
    description,
    image: imageFile.secure_url,
    imageId: imageFile.public_id,
    likedBy: [],
    creator: req.userId,
  });

  let user;
  try {
    user = await User.findById(req.userId);
  } catch (err) {
    return next(new NewError("Creating post failed, please try again.", 500));
  }

  if (!user) {
    return next(new NewError("Could not find user for provided id.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.posts.push(createdPost);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new NewError("Creating post failed, please try again.", 500));
  }

  res.status(201).json({
    message: "Post has been created successfully.",
  });
};

const deletePost = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId).populate("creator");
  } catch (err) {
    return next(
      new NewError("Something went wrong, could not delete post.", 500)
    );
  }

  if (!post) {
    return next(new NewError("Could not find post for this id.", 404));
  }

  if (post.creator._id.toString() !== req.userId) {
    return next(new NewError("You are not allowed to delete this post.", 401));
  }

  const imagePath = post.imageId;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await post.remove({ session: sess });
    post.creator.posts.pull(post);
    await post.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new NewError("Something went wrong, could not delete post.", 500)
    );
  }

  try {
    await cloudinary.uploader.destroy(imagePath);
  } catch (err) {
    console.log(`failed deleting image:${imagePath}`);
  }

  res.status(200).json({ message: "Post has been deleted successfully." });
};

const addLike = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    return next(
      new NewError("Something went wrong, could not like post.", 500)
    );
  }

  if (!post) {
    return next(new NewError("Could not find post for this id.", 404));
  }

  const liked = post.likedBy.filter((id) => id.toString() !== req.userId);

  if (liked.length > 0) {
    return next(new NewError("You liked this post before.", 404));
  }

  try {
    post.likedBy.push(req.userId);
    await post.save();
  } catch (err) {
    new NewError("Something went wrong, could not like post.", 500);
  }

  res.status(201).json({
    message: "You liked the post",
  });
};

const removeLike = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    return next(
      new NewError("Something went wrong, could not like post.", 500)
    );
  }

  if (!post) {
    return next(new NewError("Could not find post for this id.", 404));
  }

  const liked = post.likedBy.filter((id) => id.toString !== req.userId);

  if (liked.length !== 1) {
    return next(new NewError("You didn't like this post before.", 404));
  }

  try {
    post.likedBy.pull(req.userId);
    await post.save();
  } catch (err) {
    new NewError("Something went wrong, could not like post.", 500);
  }

  res.status(201).json({
    message: "You unliked the post",
  });
};

const getHomePage = async (req, res, next) => {
  const userId = req.userId;

  let user;
  try {
    user = await User.findById(userId).populate("followings");
  } catch (err) {
    return next(
      new NewError("Fetching user failed, please try again later.", 500)
    );
  }

  if (!user) {
    return next(new NewError("Could not find user for this id.", 404));
  }

  const userInfo = { _id: user._id, image: user.image };

  const newFollowed = user.followings
    .reverse()
    .slice(0, 3)
    .map((user) => ({
      _id: user._id,
      name: user.name,
      bio: user.bio,
      image: user.image,
    }));

  let ids = [];
  ids.push(user._id);
  user.followings.forEach((user) => ids.push(user._id));

  let posts;
  try {
    posts = await Post.find({ creator: { $in: ids } })
      .populate("creator")
      .sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new NewError("Fetching posts failed, please try again later.", 500)
    );
  }

  posts = posts.map((post) => {
    let liked = false;

    const like = post.likedBy.filter((id) => id !== userId);

    if (like.length > 0) {
      liked = true;
    }

    return {
      _id: post._id,
      description: post.description,
      image: post.image,
      creatorId: post.creator._id,
      creatorName: post.creator.name,
      creatorImage: post.creator.image,
      liked,
    };
  });

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

  res.status(200).json({ userInfo, newFollowed, randomUsers, posts });
};

exports.createPost = createPost;
exports.deletePost = deletePost;
exports.addLike = addLike;
exports.removeLike = removeLike;
exports.getHomePage = getHomePage;
