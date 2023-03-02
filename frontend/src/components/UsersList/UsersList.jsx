import React from "react";
import UserItem from "./UserItem";
import { AnimatePresence, motion } from "framer-motion";

const UsersList = ({ users }) => {
  return (
    <motion.ul className="users mt-3 d-flex flex-column gap-3">
      <AnimatePresence>
        {users?.length > 0 &&
          users?.map((user) => <UserItem key={user?._id} user={user} />)}
      </AnimatePresence>
    </motion.ul>
  );
};

export default UsersList;
