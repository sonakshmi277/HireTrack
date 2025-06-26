const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const Admin = require("./models/admin");
const Message = require("./models/message");
const User = require("./models/user"); 
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  })
);

app.use(userRoutes);

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

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
