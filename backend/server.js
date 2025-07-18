const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const Job = require("./models/job");
const Application = require("./models/application");
const UserInfo = require("./models/users_info");
const runSelenium = require("./utils/runSelenium");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const userSockets = new Map();
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (let [userId, sockId] of userSockets.entries()) {
      if (sockId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/chat", {
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });
app.use("/api", userRoutes);
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

app.get("/api/jobs/count", async (req, res) => {
    try {
        const count = await Job.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error("Error fetching job count:", err);
        res.status(500).json({ error: "Failed to fetch job count" });
    }
});

app.post("/api/apply", upload.single("resume"), async (req, res) => {
    try {
        const { name, email, age, education, jobId, updateExisting } = req.body;
        console.log("Incoming apply request:", { name, email, age, education, jobId, updateExisting });
        console.log("Uploaded file:", req.file ? req.file.filename : 'No file');

        let existingUser = await UserInfo.findOne({ Email: email });
        if (!existingUser) {
            if (!req.file) {
                return res.status(400).json({ error: "Resume is required for new applicants." });
            }
            console.log("New user, inserting into users_info and applications.");
            const user = await UserInfo.create({
                Name: name,
                Email: email,
                Age: age,
                Education: education,
                JobType: jobId,
                Resume: req.file.filename
            });

            console.log("Inserted into users_info:", user);

            const application = await Application.create({
                name,
                email,
                age,
                education,
                jobId,
                resume: req.file.filename,
                status: "Pending"
            });

            console.log("Inserted into applications:", application);
            return res.status(201).json({ message: "Application submitted and user data saved!", application });
        }
        console.log("User exists in users_info.");

        if (updateExisting === 'true') {
            console.log("User chose to update data. Updating UserInfo with new form data.");
            existingUser.Name = name || existingUser.Name;
            existingUser.Age = age || existingUser.Age;
            existingUser.Education = education || existingUser.Education;
            existingUser.JobType = jobId;
            if (req.file) {
                if (existingUser.Resume && fs.existsSync(path.join(__dirname, 'uploads', existingUser.Resume))) {
                    fs.unlinkSync(path.join(__dirname, 'uploads', existingUser.Resume));
                }
                existingUser.Resume = req.file.filename;
            }
            await existingUser.save();
            console.log("UserInfo updated:", existingUser);
        } else {
            console.log("User chose to auto-fill. Updating JobType for existing user (only if different).");
            if (existingUser.JobType !== jobId) {
                existingUser.JobType = jobId;
                await existingUser.save();
                console.log("Updated JobType for existing user:", existingUser.JobType);
            }
            if (!existingUser.Resume) {
              return res.status(400).json({ error: "Resume is required for auto-application if not previously saved." });
            }
        }
        const application = await Application.create({
            name: existingUser.Name,
            email: existingUser.Email,
            age: existingUser.Age,
            education: existingUser.Education,
            jobId: jobId,
            resume: existingUser.Resume,
            status: "Pending"
        });
        console.log("New application entry created for existing user:", application);
        console.log("Running Selenium to auto-fill and submit for existing user...");
        try {
            await runSelenium(existingUser);
            console.log("Selenium auto-fill completed successfully.");
        } catch (seleniumErr) {
            console.error("Selenium auto-fill failed:", seleniumErr.message, seleniumErr.stack);
            return res.status(500).json({ error: "Application automation failed. Please try again manually.", details: seleniumErr.message });
        }

        return res.status(200).json({ message: "Application auto-submitted successfully!", application });

    } catch (err) {
        console.error("Apply route error:", err);
        res.status(500).json({ error: "Server error during application process", details: err.message });
    }
});


app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title company")
      .sort({ createdAt: -1 }); 
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

    if (!email) {
        return res.status(400).json({ error: "Email query parameter is required." });
    }

    const apps = await Application.find({ email })
      .populate("jobId", "title company");

    console.log("Found applications:", apps.length);
    res.json(apps);
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/checkUser", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    const existingUser = await UserInfo.findOne({ Email: email });
    const jobs = await Job.find();

    if (existingUser) {
      return res.json({ exists: true, user: existingUser, jobs });
    } else {
      return res.json({ exists: false, jobs });
    }
  } catch (err) {
    console.error("Error in checkUser route:", err);
    res.status(500).json({ error: "Server error checking user", details: err.message });
  }  });
server.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});