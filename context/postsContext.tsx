import { createContext, useCallback, useState } from 'react';

const PostsContext = createContext({});

export default PostsContext;

export const PostsProvider = ({ children }: any) => {
  const [posts, setPosts] = useState([]);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    setPosts((prevPosts) => {
      const newPosts: any = [...prevPosts];
      postsFromSSR.forEach((post: any) => {
        const exists = newPosts.find((p: any) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
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
    if (postsResult.length < 5) {
      setNoMorePosts(true);
    }
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
    <PostsContext.Provider
      value={{ posts, noMorePosts, getPosts, setPostsFromSSR }}
    >
      {children}
    </PostsContext.Provider>
  );
};
