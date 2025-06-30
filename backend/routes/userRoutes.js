const express = require("express"); 
const router = express.Router();
const Message = require("../models/message"); 
const User = require("../models/user"); 
router.get("/user_search", async (req, res) => {
  try {
    const query = req.query.query || "";
    console.log("Searching users with:", query);
    
    const users = await User.find({
      fullName: { $regex: query, $options: "i" }
    });

    console.log("Users found:", users.map(u => u.fullName));
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/messages', async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;

        const message = new Message({
            senderId,
            receiverId,
            text,
            createdAt: new Date()
        });

        await message.save();
        await message.populate('senderId', 'fullName email');
        await message.populate('receiverId', 'fullName email');
        const receiverSocketId = req.userSockets.get(receiverId);
        if (receiverSocketId) {
            req.io.to(receiverSocketId).emit('receiveMessage', message);
            console.log(`Emitted message to ${receiverSocketId}`);
        }

        res.json(message);
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
