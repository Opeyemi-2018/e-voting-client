"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    matricNumber: "",
    userName: "",
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
        "http://localhost:5000/api/student-auth/sign-up",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      router.push("/studentAuth/signin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col justify-center items-center h-screen p-3">
      <h2 className="text-3xl font-bold mb-4">Student Sign Up</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          type="text"
          name="userName"
          placeholder="Name"
          value={form.userName}
          onChange={handleChange}
          className="w-full border border-gray-400 px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-400 px-4 py-2 rounded"
        />
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <a href="/sign-in" className="text-blue-600 hover:underline">
          Sign in here
        </a>
      </p>
    </div>
  );
}
