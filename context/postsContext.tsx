import { createContext, useCallback, useState } from 'react';

const PostsContext = createContext({});

export default PostsContext;

export const PostsProvider = ({ children }: any) => {
  const [posts, setPosts] = useState([]);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {}, []);

  return (
    <PostsContext.Provider value={{ posts, setPostsFromSSR }}>
      {children}
    </PostsContext.Provider>
  );
};