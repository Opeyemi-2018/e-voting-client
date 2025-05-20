"use client";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { Table, Select, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";

const { Option } = Select;

const Page = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/candidate/get-candidate"
        );
        setCandidates(res.data);
        setFilteredCandidates(res.data);

        // Get unique categories from candidates
        const uniqueCategories = [
          ...new Set(res.data.map((c) => c.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const filtered = candidates.filter(
      (candidate) => candidate.category === value
    );
    setFilteredCandidates(filtered);
  };

  const handleReset = () => {
    setSelectedCategory("");
    setFilteredCandidates(candidates);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={`http://localhost:5000${image}`}
          alt="candidate"
          className="rounded-full w-20 h-20 object-cover border border-[#443227]"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="text-[#443227] font-semibold">{name}</span>
      ),
    },
    {
      title: "Votes",
      dataIndex: "votes",
      key: "votes",
      render: (votes) => (
        <span className="text-[#443227] font-semibold">{votes}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <span className="text-[#443227] capitalize">{category}</span>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto md:px-6 px-3 py-8 mt-10">
      <ToastContainer />
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-end">
        <Select
          placeholder="Filter by category"
          value={selectedCategory || undefined}
          onChange={handleCategoryChange}
          style={{ width: 200 }}
          allowClear
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Option>
          ))}
        </Select>
        <Button onClick={handleReset} className="bg-[#443227] text-white">
          Reset Filter
        </Button>
      </div>

      {loading ? (
        <div className="spinner flex-col gap-6 flex items-center h-screen justify-center">
          <p>Please wait while your data loads</p>
          <ClipLoader color="#443227" size={50} loading={loading} />
        </div>
      ) : (
        <Table
          dataSource={filteredCandidates}
          columns={columns}
          rowKey="_id"
          pagination={false}
          bordered
        />
      )}
    </div>
  );
};

export default Page;
