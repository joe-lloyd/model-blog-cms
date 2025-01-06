'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface PostFormProps {
  endpoint: string;
  method: 'POST' | 'PATCH';
  initialData?: {
    title?: string;
    content?: string;
    images?: string[];
  };
}

const PostForm: React.FC<PostFormProps> = ({ endpoint, method, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]); // To store newly added images
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // Append new images to the form data
    newImages.forEach((image) => formData.append('images', image));

    try {
      const token = localStorage.getItem('token');
      formData.forEach((value, key) => console.log(key, value));
      await axios({
        method,
        url: endpoint,
        data: formData,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDeleteImage = async (imagePath: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${endpoint}/images`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { imagePath }, // Pass the image path to delete
      });
      setImages(images.filter((img) => img !== imagePath)); // Update the local state
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-2xl font-bold mb-4">{method === 'POST' ? 'New Post' : 'Edit Post'}</h1>
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
        multiple
        onChange={(e) =>
          setNewImages((prev) =>
            e.target.files ? [...prev, ...Array.from(e.target.files)] : prev
          )
        }
        className="w-full mb-4"
      />
      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Overview
        </button>
      </div>
    </form>
  );
};

export default PostForm;
