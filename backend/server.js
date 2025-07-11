const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Job = require("./models/job");
const Application = require("./models/application");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });
mongoose
  .connect("mongodb://127.0.0.1:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.post("/api/job", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error("Job save error:", err);
    res.status(500).json({ error: "Failed to save job" });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("Fetch jobs error:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.post("/api/apply", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, age, education, jobId } = req.body;

    if (!name || !email || !age || !education || !jobId || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const application = await Application.create({
      name,
      email,
      age,
      education,
      jobId,
      resume: req.file.filename,
      status: "Pending"
    });

    res.status(201).json(application);
  } catch (err) {
    console.error("Application save error:", err);
    res.status(500).json({ error: "Failed to save application" });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title company");
    res.json(applications);
  } catch (err) {
    console.error("Fetch applications error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

app.put("/api/applications/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});
app.get("/api/userApplications", async (req, res) => {
  try {
    const email = req.query.email;
    console.log("Fetching applications for:", email);

    const apps = await Application.find({ email })
      .populate("jobId", "title company");

    console.log("Found applications:", apps.length);
    res.json(apps);
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ error: err.message });
  }
});



app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
