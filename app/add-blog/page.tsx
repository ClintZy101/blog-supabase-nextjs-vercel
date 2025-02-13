'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

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

    if (!title || !content) {
      setMessage('Title and Content cannot be empty.');
      setModalOpen(true);
      return;
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, author_id: authorId, author_email: userEmail }]);

    if (error) {
      console.error('Error inserting blog:', error.message);
      setMessage('Error: ' + error.message);
      setModalOpen(true);
    } else {
      console.log('Blog inserted:', data);
      setMessage('Blog added successfully!');
      setTitle('');
      setContent('');
      setModalOpen(true);
      setTimeout(() => {
        setModalOpen(false);
        router.push('/protected');
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center "
    >
      <div className=" w-screen p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a Blog Post</h1>
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

      {/* Message Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex justify-between ">
              <h2 className="text-xl font-semibold mb-4">Message</h2>
              {/* <button onClick={() => setModalOpen(false)} className=''><X /></button> */}
            </div>
            <p className="mb-2">{message}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
