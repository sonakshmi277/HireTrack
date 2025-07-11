import React, { useState, useEffect } from "react";
import axios from "axios";
import "./applynew.css"; 

export default function ApplyNew() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    education: "",
    jobId: "",
    resume: null
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("age", formData.age);
    data.append("education", formData.education);
    data.append("jobId", formData.jobId);
    data.append("resume", formData.resume);

    try {
      await axios.post("http://localhost:5000/api/apply", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Application submitted successfully!");
      setFormData({ name: "", email: "", age: "", education: "", jobId: "", resume: null });
    } catch (err) {
      console.error("Apply failed:", err);
      alert("Failed to apply. Try again.");
    }
  };

  return (
    <div className="apply-page">
      <h2>Apply for a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="age"
          placeholder="Your Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="education"
          placeholder="Your Education"
          value={formData.education}
          onChange={handleChange}
          required
        />
        <select
          name="jobId"
          value={formData.jobId}
          onChange={handleChange}
          required
        >
          <option value="">Select Job</option>
          {jobs.map(job => (
            <option key={job._id} value={job._id}>
              {job.title} at {job.company}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}
