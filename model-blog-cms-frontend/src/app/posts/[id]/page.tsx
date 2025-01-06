'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]); // All images for the post
  const [newImage, setNewImage] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setImages(post.images || []); // Set all images
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeleteImage = async (imagePath: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/images`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { imagePath }, // Pass the image path to delete
      });
      setImages(images.filter((img) => img !== imagePath)); // Update the local state
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image} className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                alt="Post Image"
                className="w-full h-40 object-cover rounded"
              />
              <button
                onClick={() => handleDeleteImage(image)}
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white text-sm px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <input
        type="file"
        onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
        className="w-full mb-4"
      />
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Overview
        </button>
      </div>
    </form>
  );
};

export default EditPost;
