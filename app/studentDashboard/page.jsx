"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVoter } from "../context";

export default function StudentProfileDashboard() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState("");
  const { student, token } = useVoter();
  const router = useRouter();

  const { signOut } = useVoter();

  const handleSignOut = async () => {
    await signOut(); // call context method
    router.push("/studentAuth/signin"); // redirect
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!student || !token) {
      router.push("/studentAuth/signin");
    }
  }, [student, token, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!student?._id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/student-auth/student-profile/${student._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || "Something went wrong");
        }

        const data = await res.json();
        setStudentInfo(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [student?._id]);

  if (!student || !token || !studentInfo) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading student profile...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          Student Profile
        </h1>

        <div className="space-y-6 text-[17px] text-gray-700">
          <ProfileItem label="Username" value={studentInfo.userName} />
          <ProfileItem label="Email" value={studentInfo.email} />
          <ProfileItem label="Matric Number" value={studentInfo.matricNumber} />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-4 text-sm text-center text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-3">
      <span className="font-medium">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
