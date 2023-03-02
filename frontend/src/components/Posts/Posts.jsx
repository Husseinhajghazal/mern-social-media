import React from "react";
import { useSelector } from "react-redux";
import PostItem from "./PostItem";

const Post = () => {
  const posts = useSelector((state) => state.posts.posts);

  return (
    <ul className="posts">
      {posts?.length > 0 ? (
        posts?.map((post) => <PostItem key={post?._id} post={post} />)
      ) : (
        <p className="text-center">There's no posts.</p>
      )}
    </ul>
  );
};

export default Post;
