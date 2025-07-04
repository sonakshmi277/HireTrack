import React, { useState } from "react";
import "./postnew.css";

export default function PostNew() {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "",
        deadline: "",
        skills: "",
        description: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert("Job Posted Successfully!");
                setFormData({
                    title: "",
                    company: "",
                    location: "",
                    salary: "",
                    type: "",
                    deadline: "",
                    skills: "",
                    description: ""
                });
            } else {
                alert("Failed to post job.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    };

    return (
        <div className="postnew-container">
            <h2 className="form-title">Post a New Job</h2>
            <form onSubmit={handleSubmit} className="job-form">
                <div className="form-field">
                    <label>Job Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer" required />
                </div>
                <div className="form-field">
                    <label>Company</label>
                    <input name="company" value={formData.company} onChange={handleChange} placeholder="e.g. TCS, Google" required />
                </div>
                <div className="form-field">
                    <label>Location</label>
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote / Delhi" required />
                </div>
                <div className="form-field">
                    <label>Salary (Annual)</label>
                    <input name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. ₹8 LPA" />
                </div>
                <div className="form-field">
                    <label>Job Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Application Deadline</label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                </div>
                <div className="form-field">
                    <label>Required Skills</label>
                    <input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Express, MongoDB" required />
                </div>
                <div className="form-field">
                    <label>Job Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe the job..." required />
                </div>
                <button type="submit">Post Job</button>
            </form>
        </div>
    );
}
