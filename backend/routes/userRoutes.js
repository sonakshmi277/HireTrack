const express = require("express");
const router = express.Router();
const JobSeeker = require("../models/JobSeeker");
const Message = require("../models/message");
const { generateToken } = require("../utils/jwt");
const auth = require("../middleware/authMiddleware");

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    let user = await JobSeeker.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await JobSeeker.create({ fullName, email, password });
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await JobSeeker.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) return res.status(400).json({ error: "Email and fullName are required" });

    let seeker = await JobSeeker.findOne({ email });
    if (!seeker) {
      seeker = await JobSeeker.create({ email, fullName, password: "temporaryPassword123" });
      console.log("Created new JobSeeker:", seeker);
    } else {
      console.log("JobSeeker already exists:", seeker);
    }

    res.json(seeker);
  } catch (err) {
    console.error("Error registering jobseeker:", err);
    res.status(500).json({ error: "Failed to register jobseeker" });
  }
});


router.get("/messages/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const adminId = req.query.adminId;
    const messages = await Message.find({
      $or: [
        { senderId: adminId, receiverId: userId },
        { senderId: userId, receiverId: adminId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName email")
      .populate("receiverId", "fullName email");

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/messages", auth, async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    const message = new Message({ senderId, receiverId, text });
    await message.save();
    await message.populate("senderId", "fullName email");
    await message.populate("receiverId", "fullName email");

    const receiverSocketId = req.userSockets?.get(receiverId);
    if (receiverSocketId) req.io.to(receiverSocketId).emit("receiveMessage", message);

    res.json(message);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
