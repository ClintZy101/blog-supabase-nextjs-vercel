'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

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
    <div>
      <h1>Add a Blog Post</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2"
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2"
          ></textarea>
        </div>
        <div>
          <label>Author ID:</label>
          <input
            type="text"
            value={authorId}
            readOnly
            className="border p-2 bg-gray-200"
          />
        </div>
        <div className='flex space-x-5'>
            <p>Author Email:</p>
            <p> {userEmail}</p>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Add Blog
        </button>
      </form>
    </div>
  );
}
