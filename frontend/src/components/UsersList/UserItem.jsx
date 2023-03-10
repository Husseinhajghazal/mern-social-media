import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserItem = ({ user }) => {
  const navigate = useNavigate();

  return (
    <motion.li
      whileHover={{
        scale: 1.1,
      }}
      whileTap={{
        scale: 0.9,
      }}
      animate={{ x: 0, opacity: 1 }}
      initial={{ x: -200, opacity: 0 }}
      exit={{ x: -200, opacity: 0 }}
      className="d-flex"
      onClick={() => {
        navigate(`/profile/${user?._id}`);
      }}
    >
      <motion.img
        whileTap={{
          scale: 0.9,
        }}
        src={user?.image}
        alt="profile"
        style={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          marginRight: "10px",
        }}
      />
      <div className="info">
        <h6>{user?.name}</h6>
        <p>{user?.bio.split(" ").slice(0, 3).join(" ")}...</p>
      </div>
    </motion.li>
  );
};

export default UserItem;
