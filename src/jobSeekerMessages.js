import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";

export default function JobSeekerMessages() {
  const { user, isAuthenticated } = useAuth0();
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("receiveMessage", (message) => {
      console.log("Received message via Socket.IO:", message);
      if (
        (message.senderId?._id === admin?._id && message.receiverId?._id === jobSeekerId) ||
        (message.senderId?._id === jobSeekerId && message.receiverId?._id === admin?._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => newSocket.disconnect();
  }, [admin, jobSeekerId]);
  useEffect(() => {
    const fetchJobSeeker = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/user_search?query=${user.email}`);
        const found = res.data.find(u => u.email === user.email);
        if (found) {
          setJobSeekerId(found._id);
          socket?.emit("registerUser", found._id);
        }
      } catch (err) {
        console.error("Error fetching job seeker:", err);
      }
    };
    fetchJobSeeker();
  }, [user, socket]);
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user_search?query=sonakshmibhattacharya@gmail.com`);
        const found = res.data.find(u => u.email === "sonakshmibhattacharya@gmail.com");
        if (found) setAdmin(found);
      } catch (err) {
        console.error("Error fetching admin:", err);
      }
    };
    fetchAdmin();
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      if (!jobSeekerId || !admin?._id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${jobSeekerId}?adminId=${admin._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [jobSeekerId, admin]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !jobSeekerId || !admin?._id) return;
    const messageData = {
      senderId: jobSeekerId,
      receiverId: admin._id,
      text: newMessage,
    };
    try {
      const res = await axios.post("http://localhost:5000/api/messages", messageData);
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#e5ddd5' }}>
        {admin ? (
          <>
            <div style={{ padding: '15px', background: '#007bff', color: '#fff', textAlign: 'center' }}>
              <h2 style={{ margin: 0 }}>{admin.fullName}</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  style={{
                    textAlign: msg.senderId?._id === jobSeekerId ? 'right' : 'left',
                    margin: '10px 0'
                  }}
                >
                  <span style={{
                    padding: '10px 15px',
                    background: msg.senderId?._id === jobSeekerId ? '#dcf8c6' : '#edf2f7',
                    borderRadius: '18px',
                    display: 'inline-block',
                    maxWidth: '75%',
                    wordWrap: 'break-word'
                  }}>
                    {msg.text}
                    <div style={{ fontSize: '0.75em', color: '#888', marginTop: '5px' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ display: 'flex', padding: '15px', background: '#e9ecef' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{ flex: 1, padding: '12px 18px', borderRadius: '25px', border: '1px solid #bdc3c7', marginRight: '10px' }}
              />
              <button onClick={sendMessage} style={{ padding: '12px 20px', background: '#007bff', color: '#fff', borderRadius: '25px', border: 'none' }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5em', color: '#6c757d' }}>
            Loading chat...
          </div>
        )}
      </div>
    </div>
  );
}
