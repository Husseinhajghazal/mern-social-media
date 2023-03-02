import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Input from "../Input/Input";
import { RiImageAddFill } from "react-icons/ri";
import { BiShare } from "react-icons/bi";
import SharePostForm from "./SharePostForm";
import { useSelector } from "react-redux";

const PostShare = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const user = useSelector((state) => state.user.user);

  return (
    <div className="post-share">
      <div className="up mb-2">
        <motion.img
          whileTap={{
            scale: 0.9,
          }}
          onClick={() => {
            navigate(`/profile/${user?._id}`);
          }}
          src={user?.image}
          alt="profile"
          style={{ borderRadius: "50%", height: "40px" }}
        />
        <Input
          type="text"
          placeholder="What do you think..."
          onClick={() => {
            setShowForm((prev) => !prev);
          }}
        />
      </div>
      <div className="down d-flex justify-content-end">
        <motion.div
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{
            scale: 0.9,
          }}
        >
          <BiShare
            size="1.5rem"
            color="#00acee"
            className="me-3"
            onClick={() => {
              setShowForm((prev) => !prev);
            }}
          />
        </motion.div>
        <motion.div
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{
            scale: 0.9,
          }}
        >
          <RiImageAddFill
            size="1.5rem"
            color="#00acee"
            className="me-3"
            onClick={() => {
              setShowForm((prev) => !prev);
            }}
          />
        </motion.div>
      </div>
      <AnimatePresence>
        {showForm && (
          <SharePostForm
            onClick={() => {
              setShowForm((prev) => !prev);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostShare;
