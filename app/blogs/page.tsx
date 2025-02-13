"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const pageSize = 2;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("blogs").select();
        if (error) throw error;
        setBlogs(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [supabase]);

  const totalPages = Math.ceil((blogs?.length || 0) / pageSize);

  const getItemProps = (index: number) => ({
    className: `px-3 py-2 border rounded text-xs ${page === index ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`,
    onClick: () => setPage(index),
  });

  const next = () => {
    if (page === totalPages) return;
    setPage(page + 1);
  };

  const prev = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const paginatedBlogs = blogs?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="w-full text-center">
        <h1 className="font-bold text-3xl border-b py-2 uppercase">
          Blog Posts
        </h1>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : paginatedBlogs?.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="mt-10 min-w-[500px]">
          {paginatedBlogs?.map((post: any) => (
            <div
              key={post.id}
              className="group cursor-pointer border-b py-4 px-4 hover:bg-gray-100 transition-all duration-500"
              onClick={() => (window.location.href = `/blogs/${post.id}`)}
            >

              <div className="text-xl font-medium text-gray-900 ">
                {post.title}
              </div>
              
              <div>
                <div className="text-sm text-gray-500">{post.author_email}</div>
                <div className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-500 line-clamp-3">{post.content}</div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center my-10">
        <Link
          href="/protected"
          className="hover:bg-black  text-black hover:text-white border-4 border-black px-4 py-2  transition-colors duration-300 font-semibold uppercase my-10"
        >
          My Blog Posts
        </Link>
      </div>
      <div className="flex justify-between mt-10">
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-100"
          onClick={prev}
          disabled={page === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </button>
        <div className="flex items-center justify-center gap-2 ">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              {...getItemProps(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-100"
          onClick={next}
          disabled={page === totalPages}
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
