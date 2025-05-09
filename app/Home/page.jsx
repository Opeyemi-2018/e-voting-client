"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LandingPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen  max-w-6xl mx-auto  p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={showContent ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center flex flex-col justify-center items-center"
      >
        <motion.h1
          className="text-3xl font-bold text-blue-700 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          🗳️ Welcome to the National Voting Portal
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Your voice. Your vote. Your future.
        </motion.p>

        <ul className="text-left text-gray-700 mb-6 space-y-2">
          <li>
            ✅ <strong>Log in</strong> to access your voting dashboard
          </li>
          <li>
            🔍 <strong>Review candidates</strong> and their manifestos
          </li>
          <li>
            🗳️ <strong>Cast your vote</strong> securely and confidently
          </li>
          <li>
            📄 <strong>Get a confirmation receipt</strong> after voting
          </li>
        </ul>

        <p className="text-sm text-gray-500 mb-6">
          Voting is open from{" "}
          <span className="font-semibold text-blue-600">[Start Date]</span> to{" "}
          <span className="font-semibold text-blue-600">[End Date]</span>.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Login to Vote
          </button>
          <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
            Visit FAQ
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          🔒 This portal uses end-to-end encryption. Your vote is safe.
        </p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
