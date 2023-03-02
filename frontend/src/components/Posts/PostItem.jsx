import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AiOutlineDelete,
  AiOutlineHeart,
  AiTwotoneHeart,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http-hook";
import Error from "../Error/Error";
import { removePost } from "../../store/features/postsSlice";

const PostItem = ({ post }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post?.liked);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const { error, sendRequest, clearError } = useHttp();

  const addLike = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/posts/like/${post?._id}`,
        "POST",
        null,
        {
          Authorization: localStorage.getItem("token"),
        }
      );

      if (!error) {
        setLiked(true);
      }
    } catch (err) {}
  };

  const removeLike = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/posts/like/${post?._id}`,
        "DELETE",
        null,
        {
          Authorization: localStorage.getItem("token"),
        }
      );

      if (!error) {
        setLiked(false);
      }
    } catch (err) {}
  };

  const deletePost = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/posts/${post?._id}`,
        "DELETE",
        null,
        {
          Authorization: localStorage.getItem("token"),
        }
      );

      if (!error) {
        dispatch(removePost(post?._id));
      }
    } catch (err) {}
  };

  return (
    <li className="post mb-2 d-flex flex-column gap-3 ">
      <div className="up pt-3 ps-3 d-flex align-items-center">
        <motion.img
          whileTap={{
            scale: 0.9,
          }}
          onClick={() => {
            navigate(`/profile/${post?.creatorId}`);
          }}
          src={post?.creatorImage}
          alt="profile"
          style={{
            borderRadius: "50%",
            height: "40px",
            width: "40px",
            marginRight: "10px",
          }}
        />
        <h6>{post?.creatorName}</h6>
      </div>
      <div className="desc ps-3 pe-3">{post?.description}</div>
      <img src={post?.image} alt="post-pic" />
      <div className="down ps-3 pe-3 mb-3 d-flex justify-content-between">
        {liked ? (
          <motion.div
            whileHover={{
              scale: 1.2,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={removeLike}
          >
            <AiTwotoneHeart size="1.5rem" color="#00acee" />
          </motion.div>
        ) : (
          <motion.div
            whileHover={{
              scale: 1.2,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={addLike}
          >
            <AiOutlineHeart size="1.5rem" color="#00acee" />
          </motion.div>
        )}
        {user?._id === post.creatorId && (
          <div className="d-flex gap-2">
            <motion.div
              whileHover={{
                scale: 1.2,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <AiOutlineDelete
                onClick={deletePost}
                size="1.5rem"
                color="#ee0000"
              />
            </motion.div>
          </div>
        )}
      </div>
      {error && <Error text={error} clearError={clearError} />}
    </li>
  );
};

export default PostItem;
