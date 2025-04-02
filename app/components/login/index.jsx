"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useVoter } from "@/app/context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [voterID, setVoterID] = useState("");
  const router = useRouter();
  const { setVoterID: setGlobalVoterID } = useVoter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!voterID.trim()) {
      toast.error("Voter ID is required.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/unique-number/verify-uniqueID",
        {
          voterID: voterID.trim().toUpperCase(),
        }
      );

      if (res.data.success) {
        setGlobalVoterID(voterID.trim().toUpperCase()); // Store voter ID in context
        router.push("/cast-vote");
      } else {
        toast.error("Invalid or already used voter ID.");
      }
    } catch (error) {
      toast.error("Invalid or already used voter ID.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f8f6f4]">
      <ToastContainer />

      <h2 className="text-2xl font-bold mb-4">Enter Your Voter ID</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          value={voterID}
          onChange={(e) => setVoterID(e.target.value)}
          placeholder="Enter Voter ID (e.g., CSC123)"
          className="border p-3 rounded-lg w-72 text-center outline-none border-gray-300"
        />

        <button
          type="submit"
          className="bg-[#e57226] text-white px-6 py-3 rounded-lg hover:bg-[#b18161] transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
