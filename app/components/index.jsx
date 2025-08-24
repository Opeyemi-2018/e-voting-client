import Link from "next/link";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 mt-10">
      {/* Hero Section */}
      <section className="bg-[#e1dfd3] py-18 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">OAUSTECH Academic Portal</h1>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          A centralized digital platform tailored for Olusegun Agagu University
          of Science and Technology — streamlining academic processes and
          enhancing student experiences.
        </p>
        <Link
          href={"studentAuth"}
          className="bg-[#443227] text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Access Portal
        </Link>
      </section>

      {/* Call to Action */}
      <section className="bg-[#443227] text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Simplifying OAUSTECH Academics Digitally
        </h2>
        <p className="mb-6 text-lg">
          Log in to the academic portal and experience stress-free school
          management from anywhere.
        </p>
        <Link
          href={"/studentAuth/signin"}
          className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
        >
          Login to Portal
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50 text-center py-6 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} OAUSTECH Academic Portal. All rights
        reserved.
      </footer>
    </main>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// const LandingPage = () => {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [showContent, setShowContent] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowContent(true), 300);
//     return () => clearTimeout(timer);
//   }, []);
//   return (
//     <div className="min-h-screen  max-w-6xl mx-auto  p-6 flex flex-col items-center justify-center">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={showContent ? { opacity: 1, y: 0 } : {}}
//         transition={{ duration: 0.8 }}
//         className="text-center flex flex-col justify-center items-center"
//       >
//         <motion.h1
//           className="text-3xl font-bold text-[#b72522] mb-4"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 0.6 }}
//         >
//           🗳️ Welcome to the Student Voting Portal
//         </motion.h1>

//         <motion.p
//           className="text-gray-600 mb-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.7, duration: 0.6 }}
//         >
//           Your voice. Your vote. Your future.
//         </motion.p>

//         <ul className="text-left text-gray-700 mb-6 space-y-6">
//           <li>
//             ✅ <strong>Log in</strong> to access your voting dashboard
//           </li>
//           <li>
//             🔍 <strong>Review candidates</strong> and their manifestos
//           </li>
//           <li>
//             🗳️ <strong>Cast your vote</strong> securely and confidently
//           </li>
//         </ul>

//         <p className="text-sm text-gray-500 mb-6">
//           Voting is open from{" "}
//           <span className="font-semibold text-blue-600">[Start Date]</span> to{" "}
//           <span className="font-semibold text-blue-600">[End Date]</span>.
//         </p>

//         <div className="flex justify-center gap-4">
//           <Link
//             href="/voteLogin"
//             className="px-5 py-2 bg-[#b72522] hover:bg-[#6b1210] text-white rounded-full  transition"
//           >
//             Login to Vote
//           </Link>
//           <Link
//             href="/result" className="px-5 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
//             Check Result
//           </Link>
//         </div>

//         <p className="mt-6 text-xs text-gray-400">
//           🔒 This portal uses end-to-end encryption. Your vote is safe.
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default LandingPage;
