'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, useContext, createContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  author_email: string;
  created_at: string;
  content: string;
}

const BlogContext = createContext<{ blogs: Blog[]; setBlogs: (blogs: Blog[]) => void }>({
  blogs: [],
  setBlogs: () => {},
});

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  return <BlogContext.Provider value={{ blogs, setBlogs }}>{children}</BlogContext.Provider>;
};

export default function BlogPost() {
  const { blogs, setBlogs } = useContext(BlogContext);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (blogs.length === 0) {
        const { data, error } = await supabase.from('blogs').select('*').order('id', { ascending: true });
        if (error) {
          setError(error.message);
          return;
        }
        setBlogs(data as Blog[]);
      }
    };

    fetchBlogs();
  }, [blogs, setBlogs, supabase]);

  useEffect(() => {
    if (blogs.length > 0 && params?.id) {
      const index = blogs.findIndex((blog) => blog.id === Number(params.id));
      if (index !== -1) {
        setCurrentIndex(index);
        setBlog(blogs[index]);
      }
    }
  }, [blogs, params]);

  const handleNext = () => {
    if (currentIndex < blogs.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      router.push(`/blogs/${blogs[newIndex].id}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      router.push(`/blogs/${blogs[newIndex].id}`);
    }
  };

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!blog) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
      <div className="max-w-4xl w-full p-8 bg-white dark:bg-black">
        <div className="w-full justify-between flex">
          <div className="flex space-x-5">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-5 py-2 border-4 border-black transition-colors duration-300 ${
                currentIndex > 0 ? 'hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === blogs.length - 1}
              className={`px-5 py-2 border-4 border-black transition-colors duration-300 ${
                currentIndex < blogs.length - 1 ? 'hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
          <button onClick={() => router.push('/blogs')} className='px-5 flex gap-2 items-center border-4 py-2 border-black hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white transition-colors duration-300 '>
            <ArrowLeftIcon size='24' strokeWidth={1} />
            <p>Go Back</p>
          </button>
        </div>
        <h1 className='font-bold text-2xl my-5'>{blog.title}</h1>
        <div className='grid gap-2 my-5 italic'>
          <p>Author: {blog.author_email}</p>
          <p className="whitespace-nowrap text-sm text-gray-500">{new Date(blog.created_at).toLocaleString()}</p>
        </div>
        <p className='text-lg font-thin'>{blog.content}</p>
      </div>
    </div>
  );
}
