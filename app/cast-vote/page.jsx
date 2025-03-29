"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { IoPersonCircleSharp } from "react-icons/io5";

const CastVotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/candidate/get-candidate"
        );
        setCandidates(res.data);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);
  useEffect(() => {
    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
    };

    speak("Welcome to the voting page");
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-20 h-screen ">
      <ToastContainer />
      <h2 className="text-2xl font-bold">This is the cast vote page</h2>

      <div>
        {loading ? (
          <div className="spinner flex-col gap-6 flex items-center justify-center">
            <p>please wait while your data load</p>
            <ClipLoader color="#e57226" size={50} loading={loading} />
          </div>
        ) : (
          <div className="grid grid-cols-4 mt-20">
           { candidates.map((candidate) => (
            <div key={candidate._id} className=" flex items-center flex-col gap-2  capitalize  shadow-md p-3">
                <IoPersonCircleSharp size={50}/>
              <p>{candidate.name}</p>
              <p>{candidate.category}</p>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CastVotePage;
