'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use `useParams` instead of `useRouter`
import { ArrowLeftIcon } from 'lucide-react';

export default function BlogPost() {
  const [blog, setBlog] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams(); // Get dynamic `id` from URL
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params?.id) return; // Prevent fetching if `id` is not available yet

      try {
        const { data, error } = await supabase
          .from('blogs')
          .select()
          .eq('id', params.id) // Use `params.id` from `useParams`
          .single(); // Fetch a single row
        if (error) throw error;
        setBlog(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching blog:', err);
      }
    };

    fetchBlog();
  }, [params, supabase]); // Re-run effect when `params.id` changes

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!blog) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="max-w-4xl w-full p-8 bg-white dark:bg-black">
        <div className="=w-full justify-end flex">
          <button onClick={() => window.history.back()} className='px-5 flex gap-2 items-center border-4 py-2 border-black hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white transition-colors duration-300 '>
            <ArrowLeftIcon size='24' strokeWidth={1} />
            <p>Go Back</p>
          </button>
        </div>
        <h1 className='font-bold text-2xl my-5'>{blog.title}</h1>
        <div className='grid gap-2 my-5 italic'>
          <p>Author: {blog.author_email}</p>
          <p className=" whitespace-nowrap text-sm text-gray-500">{new Date(blog.created_at).toLocaleString()}</p>
        </div>
        <p className='text-lg font-thin'>{blog.content}</p>
      </div>
    </div>
  );
}
