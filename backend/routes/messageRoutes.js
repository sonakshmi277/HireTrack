const express = require("express");
const router = express.Router();
const Message = require("../models/message");
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
      console.log(`📤 Emitted message to ${receiverSocketId}`);
    }

    res.json(message);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
