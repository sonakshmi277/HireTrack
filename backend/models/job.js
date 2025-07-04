const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  salary: { type: String },
  type: { type: String },       
  deadline: { type: String },    
  skills: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
