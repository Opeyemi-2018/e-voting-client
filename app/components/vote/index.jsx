// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const VoiceVotingPage = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [uniqueNumber, setUniqueNumber] = useState("");
//   const [votes, setVotes] = useState([]);
//   const [step, setStep] = useState("start");

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/candidate/get-candidate");
//         setCandidates(res.data);
//       } catch (error) {
//         toast.error("Failed to fetch candidates");
//       }
//     };
//     fetchCandidates();
//   }, []);

//   const startVoiceRecognition = async (category) => {
//     return new Promise((resolve) => {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();
//       recognition.lang = "en-US";
//       recognition.start();

//       recognition.onresult = (event) => {
//         const text = event.results[0][0].transcript.toLowerCase();
//         resolve(text);
//       };

//       recognition.onerror = () => resolve(null);
//     });
//   };

//   const handleVoting = async () => {
//     if (!uniqueNumber) return toast.error("Enter your unique voting number");

//     for (const category of ["president", "secretary"]) {
//       const categoryCandidates = candidates.filter(c => c.category.toLowerCase() === category);
//       if (categoryCandidates.length === 0) continue;

//       // Speak and ask for the vote
//       const names = categoryCandidates.map(c => c.name).join(", ");
//       const message = `Who are you voting for as ${category}? Your options are ${names}`;
//       const utterance = new SpeechSynthesisUtterance(message);
//       speechSynthesis.speak(utterance);

//       const recognizedName = await startVoiceRecognition(category);
//       const chosenCandidate = categoryCandidates.find(c => c.name.toLowerCase() === recognizedName.toLowerCase());

//       if (!chosenCandidate) {
//         toast.error(`Could not recognize "${recognizedName}". Please try again.`);
//         return;
//       }

//       setVotes((prevVotes) => [...prevVotes, { category, candidateName: chosenCandidate.name }]);
//     }

//     // Submit votes
//     try {
//       await axios.post("http://localhost:5000/api/vote/cast-vote", { uniqueNumber, votes });
//       speechSynthesis.speak(new SpeechSynthesisUtterance("Thank you for voting!"));
//       setTimeout(() => window.location.href = "/login", 3000);
//     } catch (error) {
//       toast.error(error.response?.data?.msg || "Error submitting vote");
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center">
//       <h2 className="text-2xl font-bold mb-4">Voice Voting</h2>
//       <input
//         type="text"
//         placeholder="Enter Unique Number"
//         value={uniqueNumber}
//         onChange={(e) => setUniqueNumber(e.target.value.toUpperCase())}
//         className="border p-2 rounded mb-4"
//       />
//       <button onClick={handleVoting} className="bg-blue-500 text-white px-4 py-2 rounded">
//         Start Voting
//       </button>
//     </div>
//   );
// };

// export default VoiceVotingPage;
