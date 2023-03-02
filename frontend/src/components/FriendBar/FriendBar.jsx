import React from "react";
import { useSelector } from "react-redux";
import UserItem from "./UserItem";

const FriendBar = () => {
  const followings = useSelector((state) => state.followings.followings);
  const users = useSelector((state) => state.users.users);

  return (
    <div className="list">
      <h6>New Followed :</h6>
      <ul className="d-flex flex-column gap-2 ps-2 mt-2">
        {followings?.length > 0 ? (
          followings?.map((user) => <UserItem key={user?._id} user={user} />)
        ) : (
          <p>There's no followings yet!.</p>
        )}
      </ul>
      <h6 className="mt-3">May you be a good friends :</h6>
      <ul className="d-flex flex-column gap-2 ps-2 mt-2">
        {users?.map((user) => (
          <UserItem key={user?._id} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default FriendBar;
