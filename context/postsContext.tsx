import { createContext, useCallback, useReducer, useState } from 'react';

const PostsContext = createContext<any | null>(null);

export default PostsContext;

function postsReducer(state: any, action: any) {
  switch (action.type) {
    case 'addPosts': {
      const newPosts: any = [...state];
      action.posts.forEach((post: any) => {
        const exists = newPosts.find((p: any) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case 'deletePost': {
      const newPosts: any = [];
      state.forEach((post: any) => {
        if (post._id !== action.postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    default:
      return state;
  }
}

export const PostsProvider = ({ children }: any) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  // const [noMorePosts, setNoMorePosts] = useState(false);

  const deletePost = useCallback((postId: any) => {
    dispatch({ type: 'deletePost', postId });
  }, []);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({ type: 'addPosts', posts: postsFromSSR });
  }, []);

  const getPosts = useCallback(
    async ({ lastPostDate, getNewerPosts = false }: any) => {
      const result = await fetch(`/api/getPosts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastPostDate, getNewerPosts }),
      });

      const json = await result.json();
      const postsResult = json.posts || [];
      console.log(postsResult, 'post result');
      if (postsResult.length < 5) {
        // setNoMorePosts(true);
      }
      dispatch({ type: 'addPosts', posts: postsResult });
    },
    []
  );

  return (
    <PostsContext.Provider
      value={{ posts, getPosts, deletePost, setPostsFromSSR }}
    >
      {children}
    </PostsContext.Provider>
  );
};
