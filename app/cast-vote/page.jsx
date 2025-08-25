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
  const [activeCategory, setActiveCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/candidate/get-candidate`,
          { withCredentials: true }
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

  useEffect(() => {
    if (sortedCategories.length > 0 && !activeCategory) {
      setActiveCategory(sortedCategories[0]);
    }
  }, [sortedCategories, activeCategory]);

  const handleVoteSelection = (category, candidateName) => {
    setSelectedVotes((prev) => ({ ...prev, [category]: candidateName }));
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSidebarOpen(false); 
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vote/cast-vote`,
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

  const activeCategoryCandidates = candidates.filter(
    (c) => c.category === activeCategory
  );

  const getSelectedCount = () => Object.keys(selectedVotes).length;

  return (
    <div className="mt-16 min-h-screen bg-gray-50">
      <ToastContainer />

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-3xl font-bold text-center uppercase text-[#b72522]">
            Welcome to the voting phase
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Select your preferred candidate for each category
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6 items-center justify-center h-96">
          <p className="text-gray-600">Please wait while your data loads</p>
          <ClipLoader color="#b72522" size={50} loading={loading} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-[#b72522] text-white px-4 py-2 rounded-lg flex items-center justify-between mb-4"
            >
              <span>
                Categories ({getSelectedCount()}/{sortedCategories.length})
              </span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Categories Sidebar */}
            <div
              className={`lg:w-80 ${sidebarOpen ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-[#443227] mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {sortedCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        activeCategory === category
                          ? "bg-[#b72522] text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        {selectedVotes[category] && (
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        )}
                      </div>
                      {selectedVotes[category] && (
                        <div className="text-sm mt-1 opacity-90">
                          {selectedVotes[category]}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Progress: {getSelectedCount()} of {sortedCategories.length}{" "}
                    categories
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#b72522] h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (getSelectedCount() / sortedCategories.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidates Display Area */}
            <div className="flex-1">
              {activeCategory ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-bold mb-6 text-[#443227] border-b pb-3">
                    {activeCategory} Candidates
                  </h3>

                  {activeCategoryCandidates.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">🗳️</div>
                      <p className="text-gray-600">
                        No candidates available for {activeCategory}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                      {activeCategoryCandidates.map((candidate) => (
                        <div
                          key={candidate._id}
                          className={`border-2 rounded-xl p-6 transition-all cursor-pointer ${
                            selectedVotes[activeCategory] === candidate.name
                              ? "border-[#b72522] bg-[#ffe6d4] shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={candidate.image}
                              alt={candidate.name}
                              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-100"
                            />
                            <h4 className="text-xl font-semibold text-gray-800 mb-3 capitalize">
                              {candidate.name}
                            </h4>
                            <button
                              onClick={() =>
                                handleVoteSelection(
                                  activeCategory,
                                  candidate.name
                                )
                              }
                              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                                selectedVotes[activeCategory] === candidate.name
                                  ? "bg-[#b72522] text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-[#b72522] hover:text-white"
                              }`}
                            >
                              {selectedVotes[activeCategory] === candidate.name
                                ? "✓ Selected"
                                : "Select Candidate"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <p className="text-gray-600">
                    Select a category to view candidates
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleOpenModal}
                  className="px-8 py-4 bg-[#b72522] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#a01e1b] transition-colors"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <ClipLoader color="white" size={20} />
                      Submitting...
                    </div>
                  ) : (
                    `Submit Vote (${getSelectedCount()}/${
                      sortedCategories.length
                    })`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-[#443227]">
            Confirm Your Vote
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        className="vote-confirmation-modal"
      >
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Please review your selections before submitting:
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              {sortedCategories.map((category) => (
                <div
                  key={category}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                >
                  <span className="font-semibold text-gray-700">
                    {category}:
                  </span>
                  <span className="text-gray-900">
                    {selectedVotes[category] || (
                      <span className="text-red-500">Not selected</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {submitting && (
            <div className="flex items-center justify-center gap-3 py-4">
              <ClipLoader color="#443227" size={25} loading={submitting} />
              <span className="text-gray-600">Casting your vote...</span>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleDeleteVote}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={submitting}
            >
              Reset Selection
            </button>
            <button
              onClick={handleConfirmVote}
              className="px-6 py-2 bg-[#b72522] text-white rounded-lg hover:bg-[#a01e1b] transition-colors"
              disabled={submitting}
            >
              Confirm Vote
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CastVotePage;
