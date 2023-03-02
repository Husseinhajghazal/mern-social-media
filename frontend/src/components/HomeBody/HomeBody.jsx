import React from "react";
import FriendBar from "../FriendBar/FriendBar";
import FriendBarMobile from "../FriendBar/FriendBarMobile";
import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import { motion } from "framer-motion";

const HomeBody = () => {
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
      className="home-body"
    >
      <FriendBarMobile />
      <PostShare />
      <FriendBar />
      <Posts />
    </motion.div>
  );
};

export default HomeBody;
