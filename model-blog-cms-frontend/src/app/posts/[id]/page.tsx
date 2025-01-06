'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PostForm from '@/app/components/PostForm';
import { useParams } from 'next/navigation';

const EditPost = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInitialData(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <PostForm
      endpoint={`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`}
      method="PATCH"
      initialData={initialData}
    />
  );
};

export default EditPost;
