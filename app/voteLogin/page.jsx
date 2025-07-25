"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useVoter } from "@/app/context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fix: Get all necessary context functions
  const { setVoterID, setStudent, setToken } = useVoter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!matricNumber.trim() || !password.trim()) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/student-auth/sign-in",
        {
          matricNumber: matricNumber.trim().toUpperCase(),
          password,
        },
        {
          withCredentials: true, 
        }
      );

      const student = res.data?.student;
      const token = res.data?.token;

      if (!student) {
        toast.error("Invalid response from server.");
        return;
      }

      // **Check matric number against stored one**
      const storedStudent = localStorage.getItem("student");
      let storedMatricNumber = null;
      if (storedStudent && storedStudent !== "undefined") {
        try {
          storedMatricNumber = JSON.parse(storedStudent)?.matricNumber;
        } catch {
          storedMatricNumber = null;
        }
      }

      if (storedMatricNumber && storedMatricNumber !== student.matricNumber) {
        toast.error(
          `Matric number mismatch. You are already logged in as ${storedMatricNumber}. Please sign out first.`
        );
        setLoading(false);
        return;
      }

      if (student.voted) {
        toast.error("You have already voted.");
        return;
      }

      setVoterID(student.matricNumber);
      setStudent(student);
      setToken(token);

      toast.success("Login successful!");
      router.push("/cast-vote");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "credential used!!!.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer position="top-right" autoClose={5000} />
      <h2 className="text-2xl font-bold mb-4">Login to Vote</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          value={matricNumber}
          onChange={(e) => setMatricNumber(e.target.value)}
          placeholder="Matric Number (e.g., CSC123456)"
          className="border p-3 rounded-lg text-center outline-none border-gray-300"
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-3 rounded-lg text-center outline-none border-gray-300"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#b72522] text-white px-6 py-3 rounded-lg hover:bg-[#b18161] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <p>Verifying...</p>
              <ClipLoader color="white" size={25} />
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
