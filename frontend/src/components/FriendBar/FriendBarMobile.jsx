import React from "react";
import { useSelector } from "react-redux";
import UserItem from "./UserItem";

const FriendBarMobile = () => {
  const users = useSelector((state) => state.users.users);

  return (
    <div className="mobile-list">
      <h6 className="title">The new friends</h6>
      <ul>
        {users?.map((user) => (
          <UserItem key={user?._id} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default FriendBarMobile;
