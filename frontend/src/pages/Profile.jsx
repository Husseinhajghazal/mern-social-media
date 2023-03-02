import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import ProfileBody from "../components/ProfileBody/ProfileBody";
import ProfileHead from "../components/ProfileHead/ProfileHead";
import { useHttp } from "../hooks/http-hook";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Error from "../components/Error/Error";
import { useDispatch } from "react-redux";
import { setUser } from "../store/features/userSlice";
import { setFollowings } from "../store/features/followingsSlice";
import { setUsers } from "../store/features/usersSlice";
import { setPosts } from "../store/features/postsSlice";
import { setProfile } from "../store/features/profileSlice";

const Profile = () => {
  const uid = useParams().uid;
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const dispatch = useDispatch();

  useEffect(() => {
    const Fetch = async () => {
      try {
        const data = await sendRequest(
          `${process.env.URL}users/${uid}`,
          "GET",
          null,
          {
            Authorization: localStorage.getItem("token"),
          }
        );

        if (!error) {
          dispatch(setUser(data?.userInfo));
          dispatch(setFollowings(data?.profileFollowings));
          dispatch(setUsers(data?.randomUsers));
          dispatch(setPosts(data?.profilePosts));
          dispatch(setProfile(data?.profileInfo));
        }
      } catch (err) {}
    };

    Fetch();
  }, [dispatch, error, sendRequest, uid]);

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  return (
    <section className="profile-page">
      <Nav />
      <ProfileHead />
      <ProfileBody />
      {error && <Error text={error} clearError={clearError} />}
    </section>
  );
};

export default Profile;
