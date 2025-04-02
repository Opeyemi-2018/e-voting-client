"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useVoter } from "@/app/context";
import { Modal } from "antd"; // Importing Modal from Ant Design

const CastVotePage = () => {
  const { voterID } = useVoter();
  const [candidates, setCandidates] = useState([]);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const router = useRouter();

  useEffect(() => {
    if (!voterID) {
      toast.error("Unauthorized access. Please log in first.");
      router.push("/"); // Redirect if no voter ID
      return;
    }
  
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/candidate/get-candidate");
        console.log(res.data); // Check if the API is returning correct candidate data
        setCandidates(res.data);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCandidates();
  }, [voterID, router]);

  const handleVoteSelection = (category, candidateName) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [category]: candidateName,
    }));
  };

  const handleOpenModal = () => {
    // Only show modal if all categories have a selected candidate
    if (Object.keys(selectedVotes).length === 2) {
      setModalVisible(true);
    } else {
      toast.error("Please select a candidate for each category.");
    }
  };

  const handleConfirmVote = async () => {
    if (!voterID) {
      toast.error("Unauthorized access. Please log in.");
      router.push("/");
      return;
    }

    try {
      setSubmitting(true);
  
      // Prepare votes with candidate IDs
      const votes = Object.entries(selectedVotes).map(([category, candidateName]) => {
        const normalizedCandidateName = candidateName.trim().toLowerCase();
        const normalizedCategory = category.trim().toLowerCase();
  
        const candidate = candidates.find((c) => 
          c.name.trim().toLowerCase() === normalizedCandidateName && 
          c.category.trim().toLowerCase() === normalizedCategory
        );
  
        if (!candidate) {
          console.error(`No candidate found for ${category} with name ${candidateName}`);
        }
  
        return {
          category,
          candidateID: candidate ? candidate._id : null,
        };
      }).filter(vote => vote.candidateID); // Remove any votes without valid candidate ID
  
      if (votes.length === 0) {
        toast.error("Invalid candidate selected.");
        return;
      }
  
      // Send the vote request with candidateID
      await axios.post("http://localhost:5000/api/vote/cast-vote", {
        uniqueNumber: voterID,
        votes,
      });
      toast.success("Vote successfully cast!");
      setTimeout(() => router.push("/"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to submit vote.");
    } finally {
      setSubmitting(false);
      setModalVisible(false); // Close modal after submission
    }
  };

  const handleDeleteVote = () => {
    setSelectedVotes({}); // Reset selected votes
    setModalVisible(false); // Close modal
    toast.info("Vote selection has been reset.");
  };

  const categories = ["President", "Secretary"];

  return (
    <div className="min-h-screen  bg-[#f8f6f4]">
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
        <div className="mt-10 flex items-center flex-col px-3">
          {categories.map((category, index) => {
            const categoryCandidates = candidates.filter(
              (c) => c.category.toLowerCase() === category.toLowerCase()
            );
            return (
              <div key={index} className="mt-12 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4 text-center text-[#443227]">{category} Candidates</h3>
                <div className="flex flex-col gap-4">
                  {categoryCandidates.length === 0 ? (
                    <p>No candidates available for {category}</p>
                  ) : (
                    categoryCandidates.map((candidate) => (
                      <div
                        key={candidate._id}
                        className={`flex md:flex-row flex-col md:gap-0 gap-3 items-center justify-between p-4 border rounded-md ${
                          selectedVotes[category] === candidate.name
                            ? "border-[#e57226] bg-[#ffe6d4]"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center md:flex-row flex-col md:gap-4 gap-1">
                          <IoPersonCircleSharp size={50} />
                          <p className="capitalize">{candidate.name}</p>
                        </div>
                        <button
                          onClick={() => handleVoteSelection(category, candidate.name)}
                          className="px-4 py-2 w-full sm:w-auto bg-[#e57226] text-white rounded-md"
                        >
                          {selectedVotes[category] === candidate.name
                            ? "Selected"
                            : "Vote"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={handleOpenModal}
            className="my-10 px-6 py-3 w-full sm:w-auto bg-[#e57226] text-white rounded-md disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>
        </div>
      )}

      {/* Modal for vote confirmation */}
      <Modal
  title="Confirm Your Vote"
  visible={modalVisible}
  onCancel={() => setModalVisible(false)}
  footer={[
    <div
      key="footer"
      className="flex md:flex-row gap-4 justify-end flex-col items-center"
    >
      <button
        key="back"
        onClick={handleDeleteVote}
        className="px-4 w-full sm:w-auto py-2 bg-gray-600 text-white rounded-md"
      >
        Delete Vote
      </button>
      <button
        key="submit"
        onClick={handleConfirmVote}
        className="px-4 w-full sm:w-auto py-2 bg-[#e57226] text-white rounded-md"
      >
        Confirm Vote
      </button>
    </div>
  ]}
>
  <div className="text-[15px] text-[#443227]">
    <h3 className="">Votes:</h3>
    <ul>
      {categories.map((category) => (
        <li key={category}>
          {category}: {selectedVotes[category] || "Not selected"}
        </li>
      ))}
    </ul>
  </div>
</Modal>

    </div>
  );
};

export default CastVotePage;
