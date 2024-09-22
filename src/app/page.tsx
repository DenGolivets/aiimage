'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35, delay: 0 }}
          className="text-4xl sm:text-6xl font-bold"
        >
          AI Generate
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="text-center text-white/50"
        >
          Generate amazing images from text using AI models for free.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.35, delay: 0.7 }}
        >
          <Link href={"/create"}>
            <Button className="mt-3 font-semibold text-[1rem] p-5">
              Start Creating
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
