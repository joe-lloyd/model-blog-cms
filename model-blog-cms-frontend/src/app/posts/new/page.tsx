'use client';

import PostForm from '@/app/components/PostForm';

const NewPost = () => {
  return <PostForm endpoint={`${process.env.NEXT_PUBLIC_API_URL}/posts`} method="POST" />;
};

export default NewPost;
