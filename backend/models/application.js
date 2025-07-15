const mongoose=require("mongoose");

const applicationSchema=new mongoose.Schema({
  name: String,
  email: String,
  age: String,
  education: String,
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  resume: String,
  status: {
    type: String,
    default:"Pending"
  }
},{
  timestamps:true
});


module.exports = mongoose.model("Application",applicationSchema);


