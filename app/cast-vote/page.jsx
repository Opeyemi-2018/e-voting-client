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

  // Filter candidates by category
  const presidents = candidates.filter(
    (candidate) => candidate.category.toLowerCase() === "president"
  );
  const secretaries = candidates.filter(
    (candidate) => candidate.category.toLowerCase() === "secretary"
  );

  // Generate speech when candidates are fetched
  useEffect(() => {
    if (candidates.length > 0) {
      const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
      };

      const presidentNames =
        presidents.map((p) => p.name).join(", ") || "no candidates";
      const secretaryNames =
        secretaries.map((s) => s.name).join(", ") || "no candidates";

      const message = `Welcome to the voting page. We have ${presidentNames} contesting for the post of president. We have ${secretaryNames} as secretary.`;
      speak(message);
    }
  }, [candidates]);

  return (
    <div className="h-screen">
      <ToastContainer />
      <h2 className="text-2xl text-center font-bold bg-[#e57226] uppercase text-white w-full py-7">
        Welcome to the voting phase
      </h2>

      <div>
        {loading ? (
          <div className="spinner flex-col gap-6 flex items-center h-screen justify-center">
            <p>Please wait while your data loads</p>
            <ClipLoader color="#e57226" size={50} loading={loading} />
          </div>
        ) : presidents.length === 0 ? (
          <p className="text-center mt-20 text-gray-500 text-3xl font-semibold">
            No candidates available
          </p>
        ) : (
          <div className="mt-10 flex items-center flex-col">
            {/* President Candidates */}
            {presidents.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-center">
                  President Candidates
                </h3>
                <div className="flex items-center md:gap-20 gap-4 px-3">
                  {presidents.map((candidate) => (
                    <div
                      key={candidate._id}
                      className="flex items-center flex-col gap-2 capitalize border border-[#e57226] rounded-md shadow-md px-12 py-10"
                    >
                      <IoPersonCircleSharp size={50} />
                      <p>{candidate.name}</p>
                      <p>{candidate.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secretary Candidates */}
            {secretaries.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4 text-center">
                  Secretary Candidates
                </h3>
                <div className="flex items-center md:gap-20 gap-4 px-3">
                  {secretaries.map((candidate) => (
                    <div
                      key={candidate._id}
                      className="flex items-center flex-col gap-2 capitalize shadow-md border border-[#e57226] rounded-md px-12 py-10"
                    >
                      <IoPersonCircleSharp size={50} />
                      <p>{candidate.name}</p>
                      <p>{candidate.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CastVotePage;
