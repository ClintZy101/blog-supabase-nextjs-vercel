import { createClient } from "@/utils/supabase/server";
import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("author_id", user.id);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {/* <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div> */}
      <div className="flex flex-col gap-2 items-start w-full md:min-w-[500px]">
        <div className="w-full flex justify-between items-center">
        <h2 className="font-bold text-3xl mb-4 uppercase">My Blogs</h2>
        <Link
          href="/add-blog"
          className="hover:bg-black  text-black  hover:text-white border-4 border-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black  px-4 py-2  transition-colors duration-300 font-semibold uppercase my-10 text-center"
        >
          Add a Blog
        </Link>
        </div>
       
        {error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : blogs.length === 0 ? (
          <div className="grid gap-5">
            <p className="text-xl italic text-gray-500">
              No Blogs found. Add a blog post to get started!
            </p>
          </div>
        ) : (
          <ul className="font-thin w-full">
            {blogs.map((blog: any) => (
              <Link href={`/blogs/${blog.id}/edit`} key={blog.id}>
                <li className="group my-5 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-2 border-b">
                  <h3 className="font-semibold">{blog.title}</h3>
                  <p className="line-clamp-2">{blog.content}</p>
                  <div className="flex gap-2 items-center">
                    <p>{new Date(blog.created_at).toLocaleString()}</p>
                    <ArrowUpRight
                      size="32"
                      strokeWidth={1}
                      className="group-hover:scale-125 transition-all duration-300 group-hover:rotate-45"
                    />
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}

       
      </div>
      {/* <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div> */}
    </div>
  );
}
