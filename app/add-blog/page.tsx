'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';

export default function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id) {
        setAuthorId(user.id as string);
        setUserEmail(user.email as string);
      }
    };
    getUser();
  }, [supabase]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, author_id: authorId, author_email: userEmail }]);

    if (error) {
      console.error('Error inserting blog:', error.message);
      setMessage('Error: ' + error.message);
    } else {
      console.log('Blog inserted:', data);
      setMessage('Blog added successfully!');
      setTitle('');
      setContent('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className=" w-screen p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a Blog Post</h1>
        {message && <p className="text-center text-blue-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-64 resize-none"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author ID:</label>
            <input
              type="text"
              value={authorId}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-200"
            />
          </div>
          <div className="flex space-x-5">
            <p className="text-sm font-medium text-gray-700">Author Email:</p>
            <p className="text-sm">{userEmail}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 w-full bg-black text-white px-4 py-2  shadow-sm"
          >
            Add Blog
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
