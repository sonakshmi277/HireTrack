const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const JobSeeker = require("../models/jobseeker"); 

router.get("/user_search", async (req, res) => {
  try {
    const query = req.query.query || "";
    console.log("Searching jobseekers with:", query);

    const seekers = await JobSeeker.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    });

    console.log("Jobseekers found:", seekers.map(s => s.fullName));
    res.json(seekers);
  } catch (error) {
    console.error("Error searching jobseekers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/messages/:userId", async (req, res) => {
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

router.post("/messages", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    const message = new Message({
      senderId,
      receiverId,
      text
    });

    await message.save();
    await message.populate("senderId", "fullName email");
    await message.populate("receiverId", "fullName email");
    const receiverSocketId = req.userSockets.get(receiverId);
    if (receiverSocketId) {
      req.io.to(receiverSocketId).emit("receiveMessage", message);
      console.log(`Emitted message to ${receiverSocketId}`);
    }

    res.json(message);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ error: "Email and fullName are required" });
    }

    let seeker = await JobSeeker.findOne({ email });
    if (!seeker) {
      seeker = await JobSeeker.create({ email, fullName });
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
module.exports = router;
