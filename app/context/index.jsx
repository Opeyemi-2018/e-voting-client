"use client";
import { createContext, useContext, useState, useEffect } from "react";

const VoterContext = createContext();

export const VoterProvider = ({ children }) => {
  const [voterID, setVoterID] = useState(null);
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    const storedToken = localStorage.getItem("token");

    if (storedStudent && storedStudent !== "undefined") {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch (err) {
        console.error("Error parsing student from localStorage:", err);
      }
    }

    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (student) {
      localStorage.setItem("student", JSON.stringify(student));
    } else {
      localStorage.removeItem("student");
    }
  }, [student]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // 🚀 Sign out function
  const signOut = async () => {
    try {
      // Optional: Notify server to invalidate session
      await fetch("http://localhost:5000/api/student-auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Server sign-out failed", error);
    }

    setVoterID(null);
    setStudent(null);
    setToken(null);
    localStorage.removeItem("student");
    localStorage.removeItem("token");
  };

  return (
    <VoterContext.Provider
      value={{
        voterID,
        setVoterID,
        student,
        setStudent,
        token,
        setToken,
        signOut, // <--- Include signOut here
      }}
    >
      {children}
    </VoterContext.Provider>
  );
};

export const useVoter = () => useContext(VoterContext);
