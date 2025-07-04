const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Admin = require("./models/admin");
const Message = require("./models/message");
const User = require("./models/user");
const Job=require("./models/job");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

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
  console.log(`User connected: ${socket.id}`);

  socket.on("registerUser", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} unregistered.`);
        break;
      }
    }
  });
});

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

app.use('/api', userRoutes);
app.use('/api', messageRoutes);

app.post("/task_save", async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const add = await Admin.create(req.body);
    console.log("Admin document created:", add);
    res.json(add);
  } catch (error) {
    console.error("Error saving to DB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
mongoose
  .connect("mongodb://127.0.0.1:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

app.post("/api/job", async (req, res) => {
  console.log("Received payload:", req.body);
  try {
    const job = await Job.create(req.body);
    console.log("Job saved:", job);
    res.status(201).json(job);
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ error: "Failed to save job" });
  }
});

app.get("/api/job", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});
