"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useVoter } from "@/app/context";
import { Modal } from "antd";

const CastVotePage = () => {
  const { voterID } = useVoter();
  const [candidates, setCandidates] = useState([]);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!voterID) {
      toast.error("Please log in through the vote login page.");
      router.push("/voteLogin");
      return;
    }

    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          // "https://e-voting-server-bxpt.onrender.com/api/candidate/get-candidate"
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
  }, [router]);

  const handleVoteSelection = (category, candidateName) => {
    setSelectedVotes((prev) => ({ ...prev, [category]: candidateName }));
  };

  const handleOpenModal = () => {
    if (Object.keys(selectedVotes).length === sortedCategories.length) {
      setModalVisible(true);
    } else {
      toast.error("Please select a candidate for each category.");
    }
  };

  const handleConfirmVote = async () => {
    if (!voterID) {
      toast.error("Unauthorized access. Please log in.");
      router.push("/studentAuth");
      return;
    }

    try {
      setSubmitting(true);
      const votes = Object.entries(selectedVotes)
        .map(([category, candidateName]) => {
          const candidate = candidates.find(
            (c) =>
              c.name.trim().toLowerCase() === candidateName.trim().toLowerCase()
          );

          return candidate ? { category, candidateID: candidate._id } : null;
        })
        .filter(Boolean);

      if (votes.length === 0) {
        toast.error("Invalid candidate selection.");
        return;
      }
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/vote/cast-vote",
        // "https://e-voting-server-bxpt.onrender.com/api/vote/cast-vote",
        {
          matricNumber: voterID,
          votes,
        }
      );
      toast.success("Vote successfully cast!");
      setTimeout(() => router.push("/"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to submit vote.");
    } finally {
      setSubmitting(false);
      setModalVisible(false);
      setLoading(false);
    }
  };

  const handleDeleteVote = () => {
    setSelectedVotes({});
    setModalVisible(false);
    toast.info("Vote selection has been reset.");
  };

  const categoryOrder = [
    "President",
    "Vice President",
    "General Secretary",
    "Assistant General Secretary",
    "PRO",
  ];

  const availableCategories = [...new Set(candidates.map((c) => c.category))];
  const sortedCategories = categoryOrder.filter((cat) =>
    availableCategories.includes(cat)
  );

  return (
    <div className="mt-16">
      <ToastContainer />
      <h2 className="text-2xl text-center font-bold  uppercase text-[#b72522] w-full py-7">
        Welcome to the voting phase
      </h2>
      {loading ? (
        <div className="spinner flex-col gap-6 flex items-center h-screen justify-center">
          <p>Please wait while your data loads</p>
          <ClipLoader color="#e57226" size={50} loading={loading} />
        </div>
      ) : (
        <div className="mt-10 flex items-center flex-col px-3">
          {sortedCategories.map((category, index) => {
            const categoryCandidates = candidates.filter(
              (c) => c.category === category
            );
            return (
              <div key={index} className="mt-4 w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4 text-center text-[#443227]">
                  {category} Candidates
                </h3>
                <div className="flex flex-col gap-4">
                  {categoryCandidates.length === 0 ? (
                    <p>No candidates available for {category}</p>
                  ) : (
                    categoryCandidates.map((candidate) => (
                      <div
                        key={candidate._id}
                        className={`flex md:flex-row flex-col md:gap-0 gap-3 items-center justify-between p-2 border rounded-md ${
                          selectedVotes[category] === candidate.name
                            ? "border-[#b72522] bg-[#ffe6d4]"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center md:flex-row flex-col md:gap-4 gap-1">
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="md:w-36 w-full md:h-36 h-full rounded-sm object-cover"
                          />

                          <p className="capitalize">{candidate.name}</p>
                        </div>
                        <button
                          onClick={() =>
                            handleVoteSelection(category, candidate.name)
                          }
                          className="px-4 py-2 w-full sm:w-auto bg-[#b72522] text-white rounded-md"
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
            className="my-10 px-6 py-3 w-full sm:w-auto bg-[#b72522] text-white rounded-md disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>
        </div>
      )}

      <Modal
        title="Confirm Your Vote"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <div key="modal-footer" className="flex gap-4 justify-end">
            <button
              key="back"
              onClick={handleDeleteVote}
              className="px-4 w-full sm:w-auto py-2 bg-[#443227] text-white rounded-md"
            >
              Delete Vote
            </button>
            ,
            <button
              key="submit"
              onClick={handleConfirmVote}
              className="px-4 w-full sm:w-auto py-2 bg-[#b72522] text-white rounded-md"
            >
              Confirm Vote
            </button>
            ,
          </div>,
        ]}
      >
        <div className="flex justify-between">
          <div className="text-[15px] text-[#443227]">
            <h3 className="">Kindly go through before submitting </h3>
            <ul className="font-semibold space-y-2">
              {sortedCategories.map((category) => (
                <li key={category}>
                  {category}: {selectedVotes[category] || "Not selected"}
                </li>
              ))}
            </ul>
          </div>

          {submitting && (
            <div className="spinner  flex flex-col items-center gap-3 justify-center">
              <p>casting....</p>
              <ClipLoader color="#443227" size={25} loading={submitting} />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CastVotePage;
