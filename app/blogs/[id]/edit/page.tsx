"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

export default function BlogPost() {
  const [blog, setBlog] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState<string>("");
  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchBlogAndUser = async () => {
      if (!params?.id) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        const { data, error } = await supabase
          .from("blogs")
          .select("id, title, content, author_email, created_at")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        setBlog(data);
        setUpdatedContent(data?.content || "");
        setUpdatedTitle(data?.title || "");

        if (user?.email !== data.author_email) {
          setError("You are not authorized to edit this blog.");
          setTimeout(() => {
            router.push(`/blogs/${params.id}`);
          }, 3000);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlogAndUser();
  }, [params.id, supabase, router]);

  const handleSave = async () => {
    if (!blog) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .update({ title: updatedTitle, content: updatedContent })
        .eq("id", blog.id)
        .eq("author_email", user.email);

      if (error) throw error;

      setBlog((prev: any) => ({
        ...prev,
        title: updatedTitle,
        content: updatedContent,
      }));
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating blog:", err);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blog.id)
        .eq("author_email", user.email);

      if (error) throw error;

      console.log("Blog deleted successfully!");
      setIsModalOpen(false);
      router.push("/blogs");
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting blog:", err);
    }
  };

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!blog) return <p>Loading...</p>;

  const isAuthor = user?.email === blog.author_email;

  return (
    <div>
      {!isEditing && isAuthor && (
        <div className="flex space-x-10 h-14 items-center w-full justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-black text-white px-10 hover:border-4 border-black border-4 hover:text-black transition-colors duration-300 hover:bg-white py-2 shadow-sm uppercase"
        >
          Edit
        </button>
         <button
         onClick={() => setIsModalOpen(true)}
         className="bg-red-500 text-white px-10 hover:border-4 border-red-500 border-4 hover:text-red-500  uppercase transition-colors duration-300 hover:bg-white py-2 shadow-sm"
       >
         Delete Blog
       </button>
       </div>
      )}

      {isEditing ? (
        <input
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          placeholder={blog.title}
          className="min-w-[500px] h-16 text-2xl px-5"
        />
      ) : (
        <h1 className="font-bold text-2xl my-5">{blog.title}</h1>
      )}

      <div className="grid gap-2 my-5 italic">
        <p>Author: {blog.author_email}</p>
        <p className="whitespace-nowrap text-sm text-gray-500">
          {new Date(blog.created_at).toLocaleString()}
        </p>
      </div>

      {isAuthor ? (
        <div>
          {isEditing ? (
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="min-w-[700px] p-2 border rounded-md"
              rows={15}
            />
          ) : (
            <p className="text-lg font-thin">{blog.content}</p>
          )}
          <div className="flex gap-2 mt-4">
            {isEditing && (
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 shadow-sm"
              >
                Save
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white px-4 py-2 shadow-sm"
              >
                Cancel
              </button>
            )}
          </div>
         
        </div>
      ) : (
        <p className="text-lg font-thin">{blog.content}</p>
      )}

      <button
        onClick={() => window.history.back()}
        className="px-5 my-5 flex gap-2 items-center border-4 py-2 border-black hover:bg-black hover:text-white transition-colors duration-300"
      >
        <ArrowLeftIcon size="24" strokeWidth={1} />
        <p>Go Back</p>
      </button>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-2">
              Type <strong>{blog.title}</strong> to confirm deletion.
            </p>
            <input
              type="text"
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmTitle !== blog.title}
                className={`px-4 py-2 rounded ${
                  confirmTitle === blog.title
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
