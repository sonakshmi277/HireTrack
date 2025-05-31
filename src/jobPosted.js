import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

export default function JobPosted() {
  const [selectedJob, setSelectedJob] = useState(null);
  const modalRef = useRef();

  const jobData = [
    { title: "Frontend Developer", company: "ABC Corp" },
    { title: "Backend Developer", company: "XYZ Pvt Ltd" },
    { title: "Full Stack Engineer", company: "TechNova" },
    { title: "DevOps Specialist", company: "CloudSync" },
  ];

  const handleDownload = () => {
    const element = modalRef.current;
    html2pdf().from(element).save(`${selectedJob.title}_Details.pdf`);
  };

  return (
    <div className="jobDiv1">
      <div className="TotBox">
        <div className="Boxes Header">
          <div className="BoxesB"><h5>Job Title</h5></div>
          <div className="BoxesB"><h5>Company Name</h5></div>
          <div className="BoxesB"><h5>Click to View Details</h5></div>
        </div>

        {jobData.map((job, index) => (
          <div className="Boxes" key={index}>
            <div className="BoxesB"><p>{job.title}</p></div>
            <div className="BoxesB"><p>{job.company}</p></div>
            <div className="BoxesB">
              <p>
                <button
                  onClick={() => setSelectedJob(job)}
                  style={{ color: "blue", border: "none", background: "none", cursor: "pointer" }}
                >
                  View
                </button>
              </p>
            </div>
          </div>
        ))}
      </div>
      {selectedJob && (
        <div className="modalOverlay">
          <div className="modalContent" ref={modalRef}>
            <h2>Job Details</h2>
            <p><strong>Title:</strong> {selectedJob.title}</p>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Description:</strong> This is a sample job description.</p>
            <div className="modalActions">
              <button onClick={handleDownload}>Download PDF</button>
              <button onClick={() => setSelectedJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
