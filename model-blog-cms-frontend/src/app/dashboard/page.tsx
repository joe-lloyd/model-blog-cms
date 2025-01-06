'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  content: string;
  images?: Array<string>;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== id)); // Refresh the grid
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4 mr-4"
        >
          Logout
        </button>
        <button
          onClick={() => router.push('/posts/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          New Post
        </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded overflow-hidden shadow">
            {post.images && !!post.images.length && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${post.images[0]}`}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="font-bold text-lg truncate">{post.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => router.push(`/posts/${post.id}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
