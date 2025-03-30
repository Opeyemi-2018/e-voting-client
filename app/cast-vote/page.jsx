"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

const CastVotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const speak = (text) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.onend = resolve;
      speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    speak("Welcome to the voting phase");
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/candidate/get-candidate");
        setCandidates(res.data);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const presidents = candidates.filter((c) => c.category.toLowerCase() === "president");
  const secretaries = candidates.filter((c) => c.category.toLowerCase() === "secretary");

  const recognizeSpeech = async (maxNumber) => {
    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Speech recognition is NOT supported in this browser.");
        return resolve(null);
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        const number = parseInt(transcript.match(/\d+/)?.[0], 10); // Extract number
        recognition.stop();

        if (!isNaN(number) && number >= 1 && number <= maxNumber) {
          resolve(number);
        } else {
          toast.error("Invalid choice. Please say a valid number.");
          resolve(null);
        }
      };

      recognition.onerror = (event) => {
        toast.error(`Speech recognition error: ${event.error}`);
        recognition.stop();
        resolve(null);
      };
    });
  };

  useEffect(() => {
    if (candidates.length === 0) return;

    const initiateVoting = async () => {
      const getVote = async (category, candidates) => {
        if (candidates.length === 0) return null;

        await speak(`For the position of ${category}, we have:`);
        for (let i = 0; i < candidates.length; i++) {
          await speak(`Number ${i + 1}, ${candidates[i].name}.`);
        }
        await speak("Say the number of your chosen candidate.");

        let vote = null;
        while (vote === null) {
          vote = await recognizeSpeech(candidates.length);
          if (vote === null) {
            await speak("Invalid choice. Please try again.");
          }
        }

        return candidates[vote - 1].name;
      };

      const presidentVote = await getVote("President", presidents);
      if (presidentVote) {
        await axios.post("http://localhost:5000/api/vote/cast-vote", {
          category: "president",
          vote: presidentVote,
        });
      }

      const secretaryVote = await getVote("Secretary", secretaries);
      if (secretaryVote) {
        await axios.post("http://localhost:5000/api/vote/cast-vote", {
          category: "secretary",
          vote: secretaryVote,
        });
      }

      await speak("Thank you for voting. You will now be logged out.");
      setTimeout(() => router.push("/"), 4000);
    };

    initiateVoting();
  }, [candidates]);

  return (
    <div className="h-screen">
      <ToastContainer />
      <h2 className="text-2xl text-center font-bold bg-[#e57226] uppercase text-white w-full py-7">
        Welcome to the voting phase
      </h2>
      {loading ? (
        <div className="spinner flex-col gap-6 flex items-center h-screen justify-center">
          <p>Please wait while your data loads</p>
          <ClipLoader color="#e57226" size={50} loading={loading} />
        </div>
      ) : (
        <div className="mt-10 flex items-center flex-col">
          {[{ title: "President Candidates", list: presidents }, { title: "Secretary Candidates", list: secretaries }].map(
            (section, index) => (
              <div key={index} className="mt-12">
                <h3 className="text-xl font-bold mb-4 text-center">{section.title}</h3>
                <div className="flex items-center md:gap-20 gap-4 px-3">
                  {section.list.map((candidate, i) => (
                    <div
                      key={candidate._id}
                      className="flex items-center flex-col gap-2 capitalize shadow-md border border-[#e57226] rounded-md px-12 py-10"
                    >
                      <IoPersonCircleSharp size={50} />
                      <p>{i + 1}. {candidate.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CastVotePage;
