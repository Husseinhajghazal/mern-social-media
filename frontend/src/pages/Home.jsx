import React, { useEffect } from "react";
import HomeBody from "../components/HomeBody/HomeBody";
import Nav from "../components/Nav/Nav";
import { useHttp } from "../hooks/http-hook";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Error from "../components/Error/Error";
import { useDispatch } from "react-redux";
import { setUser } from "../store/features/userSlice";
import { setFollowings } from "../store/features/followingsSlice";
import { setUsers } from "../store/features/usersSlice";
import { setPosts } from "../store/features/postsSlice";

const Home = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const dispatch = useDispatch();

  useEffect(() => {
    const Fetch = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/posts/`,
          "GET",
          null,
          {
            Authorization: localStorage.getItem("token"),
          }
        );

        if (!error) {
          dispatch(setUser(data?.userInfo));
          dispatch(setFollowings(data?.newFollowed));
          dispatch(setUsers(data?.randomUsers));
          dispatch(setPosts(data?.posts));
        }
      } catch (err) {}
    };

    Fetch();
  }, [dispatch, error, sendRequest]);

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  return (
    <section className="home-page">
      <Nav />
      <HomeBody />
      {error && <Error text={error} clearError={clearError} />}
    </section>
  );
};

export default Home;
