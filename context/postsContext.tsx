import { createContext, useCallback, useState } from 'react';

const PostsContext = createContext({});

export default PostsContext;

export const PostsProvider = ({ children }: any) => {
  const [posts, setPosts] = useState([]);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    setPosts(postsFromSSR);
  }, []);

  const getPosts = useCallback(async ({ lastPostDate }: any) => {
    const result = await fetch(`/api/getPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lastPostDate }),
    });

    const json = await result.json();
    const postsResult = json.posts || [];
    console.log(postsResult, 'post result');
    setPosts((prevPosts) => {
      const newPosts: any = [...prevPosts];
      postsResult.forEach((post: any) => {
        const exists = newPosts.find((p: any) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  return (
    <PostsContext.Provider value={{ posts, getPosts, setPostsFromSSR }}>
      {children}
    </PostsContext.Provider>
  );
};
