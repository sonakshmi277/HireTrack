import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import "./applynew.css"; 

export default function ApplyNew() {
  const [jobs, setJobs] = useState([]);
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    education: "",
    jobId: "",
    resume: null,
    updateExisting: false 
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.error("Error fetching jobs:", err));

    if (location.state) {
      if (location.state.mode === 'update' && location.state.userData) {
        const { userData } = location.state;
        setFormData(prev => ({
          ...prev,
          name: userData.Name || "",
          email: userData.Email || "",
          age: userData.Age ? userData.Age.toString() : "",
          education: userData.Education || "",
          updateExisting: true 
        }));
      } else if (location.state.mode === 'new') {
      }
    }
  }, [location]);

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
    if (formData.resume) {
      data.append("resume", formData.resume);
    }
    data.append("updateExisting", formData.updateExisting ? "true" : "false"); 

    try {
      const response = await axios.post("http://localhost:5000/api/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) { 
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            const responseJson = response.data;
            alert(responseJson.message || "Application submitted successfully!");
        } else {
            alert("Application submitted successfully!");
        }
      } else {
          const errorText = response.data?.error || "Unknown error during submission.";
          alert(`Application failed: ${errorText}`);
      }
      
      setFormData({ name: "", email: "", age: "", education: "", jobId: "", resume: null, updateExisting: false });

    } catch (err) {
      console.error("Apply failed in handleSubmit:", err);
      if (err.response) {
          const errorMessage = err.response.data?.error || err.message || 'Unknown error';
          alert(`Application failed: ${errorMessage}`);
      } else {
          alert("An unexpected error occurred. Please try again. Check console for details.");
      }
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
          required={!formData.updateExisting || (formData.updateExisting && !formData.resume)}
        />
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}