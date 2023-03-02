import React, { useState } from "react";
import cover from "../../assets/cover.jpg";
import Button from "../Button/Button";
import { motion } from "framer-motion";
import { useHttp } from "../../hooks/http-hook";
import Error from "../Error/Error";
import { useSelector } from "react-redux";

const ProfileHead = () => {
  const { error, sendRequest, clearError } = useHttp();

  const profile = useSelector((state) => state.profile.profile);

  const [followed, setFollowed] = useState(profile?.followed);

  const follow = async () => {
    try {
      await sendRequest(
        `${process.env.URL}users/${profile?._id}`,
        "POST",
        null,
        {
          Authorization: localStorage.getItem("token"),
        }
      );

      if (!error) {
        setFollowed((prev) => !prev);
      }
    } catch (err) {}
  };

  const unfollow = async () => {
    try {
      await sendRequest(
        `${process.env.URL}users/${profile?._id}`,
        "DELETE",
        null,
        {
          Authorization: localStorage.getItem("token"),
        }
      );

      if (!error) {
        setFollowed((prev) => !prev);
      }
    } catch (err) {}
  };

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
      className="profile-head d-flex flex-column align-items-center pb-3"
    >
      <div className="image d-flex align-items-center">
        <img src={cover} alt="cover" className="img-fluid" />
      </div>
      <img className="picture" src={profile?.image} alt="profile-pic" />
      <h1>{profile?.name}</h1>
      <p className="mb-2">{profile?.bio}</p>
      {followed ? (
        <Button type="button" text="unFollow" onClick={unfollow} />
      ) : (
        <Button type="button" text="Follow" onClick={follow} />
      )}
      {error && <Error text={error} clearError={clearError} />}
    </motion.div>
  );
};

export default ProfileHead;
