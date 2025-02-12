'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, content, author }]);

    if (error) {
      console.error('Error inserting blog:', error.message);
      setMessage('Error: ' + error.message);
    } else {
      console.log('Blog inserted:', data);
      setMessage('Blog added successfully!');
      setTitle('');
      setContent('');
      setAuthor('');
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
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border p-2"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Add Blog
        </button>
      </form>
    </div>
  );
}
