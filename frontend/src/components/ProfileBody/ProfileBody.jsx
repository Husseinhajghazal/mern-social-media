import React from "react";
import FriendBar from "../FriendBar/FriendBar";
import FriendBarMobile from "../FriendBar/FriendBarMobile";
import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const ProfileBody = () => {
  const profile = useSelector((state) => state.profile.profile);
  const user = useSelector((state) => state.user.user);

  return (
    <motion.div
      initial={{
        x: -200,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      className="profile-body"
    >
      {profile?._id === user?._id ? (
        <>
          <FriendBarMobile />
          <PostShare />
          <FriendBar />
          <Posts />
        </>
      ) : (
        <>
          <FriendBarMobile />
          <Posts />
          <FriendBar />
        </>
      )}
    </motion.div>
  );
};

export default ProfileBody;
