const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");

router.get("/user_search", async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      fullName: { $regex: query, $options: "i" }
    }).select("_id fullName email profilePic");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/messages/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const admin = await User.findOne({ email: "sonakshmibhattacharya@gmail.com" });

    const messages = await Message.find({
      $or: [
        { senderId: admin._id, receiverId: userId },
        { senderId: userId, receiverId: admin._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/messages", async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      text
    });
    await newMessage.save();
    const populatedMessage = await newMessage.populate("senderId", "fullName profilePic").execPopulate();
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;