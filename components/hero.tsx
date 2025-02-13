"use client"
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  // bg-gradient-to-b from-gray-100 to-gray-300 
  return (
    <div className="flex flex-col gap-10 items-center justify-center px-6 py-10 -mt-10">
      <motion.div
        className="text-5xl lg:text-6xl font-extrabold text-gray-800 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Embracing Life, One Story at a Time
      </motion.div>
      
      <motion.div
        className="text-lg lg:text-xl text-gray-600 max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Explore the beauty of existence, find inspiration in everyday moments, and embark on a journey of self-discovery through heartfelt stories and reflections.
      </motion.div>
      
      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Link href="/blogs" className="px-6 py-3 bg-gray-800 text-white text-lg font-semibold rounded-full shadow-md hover:bg-gray-900 transition-all">

            Read Stories
        </Link>
      </motion.div>
      
      <motion.div
        className="w-full p-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      />
    </div>
  );
}
