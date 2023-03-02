import React, { useState } from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { MdSettings } from "react-icons/md";
import Button from "../Button/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchModal from "../SearchModal/SearchModal";
import { useSelector } from "react-redux";

const Nav = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.user.user);

  return (
    <nav
      className="d-flex justify-content-between align-items-center p-3 pt-md-4 pb-md-4 ps-md-5 pe-md-5"
      style={{
        backgroundColor: "#fff",
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      <AnimatePresence>
        <motion.img
          whileHover={{
            transition: {
              duration: 0.3,
            },
            boxShadow: "0 0 10px 0 #00abee49",
          }}
          whileTap={{
            scale: 0.9,
          }}
          onClick={() => {
            navigate(`/profile/${user?._id}`);
          }}
          src={user?.image}
          alt="profile"
          style={{ borderRadius: "50%", height: "40px", width: "40px" }}
        />
      </AnimatePresence>
      <ul className="d-flex align-items-center">
        <motion.li
          whileHover={{
            scale: 1.2,
            color: "#00acee",
          }}
          whileTap={{
            scale: 0.9,
          }}
        >
          <AiOutlineSearch
            className="me-2 me-md-3"
            size="1.5rem"
            onClick={() => {
              setShow((prev) => !prev);
            }}
          />
        </motion.li>
        <motion.li
          whileHover={{
            scale: 1.2,
            color: "#00acee",
          }}
          whileTap={{
            scale: 0.9,
          }}
        >
          <MdSettings
            className="me-2 me-md-3"
            size="1.5rem"
            onClick={() => {
              navigate("/settings");
            }}
          />
        </motion.li>
        <motion.li
          whileHover={{
            scale: 1.2,
            color: "#00acee",
          }}
          whileTap={{
            scale: 0.9,
          }}
        >
          <AiOutlineHome
            className="me-2 me-md-3"
            size="1.5rem"
            onClick={() => {
              navigate("/");
            }}
          />
        </motion.li>
        <li>
          <Button
            type="button"
            text="Logout"
            onClick={() => {
              localStorage.removeItem("expiresIn");
              localStorage.removeItem("token");
              window.location.reload();
            }}
          />
        </li>
      </ul>
      <AnimatePresence>
        {show && (
          <SearchModal
            onClick={() => {
              setShow((prev) => !prev);
            }}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;
