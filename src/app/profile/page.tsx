"use client";

import { downloadImage } from "@/utils/downloadImage";
import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/image");
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const deletePost = async (id: string) => {
    try {
      const response = await fetch("/api/image", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const scrollPosition = window.scrollY;
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        window.scrollTo(0, scrollPosition);
      } else {
        const data = await response.json();
        console.error("Error deleting post:", data.error);
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <div className="w-full min-h-dvh p-3 pt-[72px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-6 mb-6" key={posts.length}>
      {loading ? (
        <div className="col-span-full flex justify-center items-center">
          <Loader
            className="animate-spin flex justify-center items-center text-white"
            size={50}
          />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {posts.map((post, index) => {
            return (
              <motion.div
                key={post.id}
                className="w-full h-full p-3 border rounded-md"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Image
                  src={post.url}
                  alt={post.prompt}
                  width={350}
                  height={250}
                  className="object-cover w-full h-[250px] md:h-[300px] lg:h-[400px] 2xl:h-[500px] rounded-md"
                />
                <p className="text-white/80 text-base mt-2 capitalize">
                  {post.prompt}
                </p>
                <div className="flex flex-col xl:flex-row items-center justify-between mt-2 gap-2">
                  <a
                    href={post.url}
                    download={`image-${post.prompt}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-white transition-all duration-300 bg-cyan-600 hover:bg-cyan-700 font-semibold rounded-md px-4 py-2"
                  >
                    Look full image
                  </a>
                  <button
                    onClick={() =>
                      downloadImage(post.url, `image-${post.prompt}.jpg`)
                    }
                    className="inline-flex 2xl:ml-14 items-center justify-between ml-0 text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 font-semibold rounded-md px-4 py-2"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="inline-flex items-center justify-center text-white bg-red-500 hover:bg-red-600 font-semibold rounded-md px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
