"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVoter } from "@/app/context";
import Link from "next/link";
export default function SignInPage() {
  const router = useRouter();
  const { setStudent, setToken } = useVoter();

  const [form, setForm] = useState({
    matricNumber: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/student-auth/sign-in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setStudent(data.student);
      setToken(data.token);
      router.push("/studentDashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col justify-center items-center h-screen p-3">
      <h2 className="text-3xl font-bold mb-4">Student Sign In</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          type="text"
          name="matricNumber"
          placeholder="Matric Number"
          value={form.matricNumber}
          onChange={handleChange}
          className="w-full border border-gray-400 px-4 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-400 px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-[#b72522] text-white py-2 rounded "
        >
          Sign In
        </button>
      </form>

      <p className="mt-4">
        No account?{" "}
        <Link
          href="/studentAuth/signup"
          className="text-[#b72522] hover:underline"
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
}
