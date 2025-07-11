const mongoose = require('mongoose');

const JobSeekerSchema = new mongoose.Schema(
  {
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true }
}, 
{ timestamps: true }
);

module.exports = mongoose.model('JobSeeker', JobSeekerSchema);
