import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import "./SearchModal.css";
import { AiOutlineClose } from "react-icons/ai";
import Input from "../Input/Input";
import UsersList from "../UsersList/UsersList";
import Error from "../Error/Error";
import { useHttp } from "../../hooks/http-hook";

const SearchModal = ({ onClick }) => {
  const { error, sendRequest, clearError } = useHttp();
  const [users, setUsers] = useState([]);

  const search = useCallback(
    async (e) => {
      if (e.target.value.trim().length !== 0) {
        const data = await sendRequest(
          `${process.env.URL}users/search/${e.target.value}`,
          "GET",
          null,
          { Authorization: localStorage.getItem("token") }
        );
        if (!error) {
          setUsers(data.users);
        }
      }
    },
    [error, sendRequest]
  );

  return ReactDOM.createPortal(
    <div className="search-modal">
      <motion.div className="form">
        <motion.div animate={{ y: 0 }} initial={{ y: -600 }} exit={{ y: -600 }}>
          <Input type="text" placeholder="Write usename..." onChange={search} />
        </motion.div>
        <UsersList users={users} />
      </motion.div>
      <motion.div
        whileHover={{
          scale: 1.2,
          color: "#ee0000",
        }}
        whileTap={{
          scale: 0.9,
        }}
        animate={{
          x: 0,
        }}
        initial={{
          x: 50,
        }}
        exit={{
          x: 50,
        }}
        className="close"
      >
        <AiOutlineClose size="1.5rem" onClick={onClick} />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
        }}
        initial={{ opacity: 0 }}
        exit={{
          opacity: 0,
        }}
        className="background"
        onClick={onClick}
      />
      {error && <Error text={error} clearError={clearError} />}
    </div>,
    document.getElementById("search-root")
  );
};

export default SearchModal;
