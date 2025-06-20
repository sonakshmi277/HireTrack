const express = require('express');
const app=express();
const mongoose=require('mongoose');
const {Server}=require("socket.io");
const cors=require("cors");
const { error } = require('console');
const PORT=5000;
const http = require("http");
const server = http.createServer(app);

const Admin=require("./models/admin");

app.use(express.json());
app.use(cors({
  origin:"http://localhost:3000",
  methods:["GET","POST"],
  allowedHeaders:["Content-type"]
}));
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

mongoose.connect("mongodb://127.0.0.1:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(error => console.error("MongoDB Connection Error:", error));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


app.post('/task_save', async (req, res) => {
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
