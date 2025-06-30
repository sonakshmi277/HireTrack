import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import io from "socket.io-client";

export default function Message() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const adminEmail = "sonakshmibhattacharya@gmail.com";
  const adminFullName = "Sonakshmi Bhattacharya";
  const [adminId, setAdminId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server: ", newSocket.id);
    });

    newSocket.on("receiveMessage", (message) => {
      console.log("Received message via Socket.IO:", message);
      const otherUser = message.senderId?._id === adminId ? message.receiverId : message.senderId;
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(msg => msg._id === message._id);
        if (!isDuplicate && selectedUser && otherUser._id === selectedUser._id) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });

      setRecentChats((prev) => {
        if (!prev.find(u => u._id === otherUser._id)) {
          return [...prev, otherUser];
        }
        return prev;
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server.");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [adminId, selectedUser]);

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user_search?query=${adminFullName}`);
        const admin = res.data.find(user => user.email === adminEmail);
        if (admin) {
          setAdminId(admin._id);
          console.log("Admin ID set:", admin._id);
          socket?.emit("registerUser", admin._id);
        } else {
          console.warn("Admin not found.");
        }
      } catch (err) {
        console.error("Error fetching admin:", err);
      }
    };
    fetchAdminId();
  }, [socket]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/user_search?query=${search}`);
        const filtered = res.data.filter(user => user.email !== adminEmail);
        setSearchResults(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const delay = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delay);
  }, [search, adminEmail]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !adminId) return;

    const messageData = {
      senderId: adminId,
      receiverId: selectedUser._id,
      text: newMessage,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/messages", messageData);
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");

      setRecentChats(prev => {
        if (!prev.find(u => u._id === selectedUser._id)) {
          return [...prev, selectedUser];
        }
        return prev;
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !adminId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${selectedUser._id}?adminId=${adminId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching message history:", err);
      }
    };
    fetchMessages();
  }, [selectedUser, adminId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div style={{ width: '25%', background: '#e8ebee', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #ccc', background: '#d0d3d6' }}>
          <h2 style={{ margin: 0 }}>Messages</h2>
        </div>

        <div style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search users'
            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #bdc3c7', backgroundColor: '#e9eff1' }}
          />
          <div style={{ marginLeft: '10px', padding: '10px', borderRadius: '50%', background: '#007bff', color: '#fff' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {search.trim()
            ? searchResults.map(user => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                style={{
                  padding: '12px 15px',
                  cursor: 'pointer',
                  background: selectedUser?._id === user._id ? '#cbe0f4' : 'transparent',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <h3 style={{ margin: 0 }}>{user.fullName}</h3>
              </div>
            ))
            : recentChats.map(user => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                style={{
                  padding: '12px 15px',
                  cursor: 'pointer',
                  background: selectedUser?._id === user._id ? '#cbe0f4' : 'transparent',
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <h3 style={{ margin: 0 }}>{user.fullName}</h3>
              </div>
            ))
          }
          {search.trim() && searchResults.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6c757d', padding: '15px' }}>No other users found.</p>
          )}
          {!search.trim() && recentChats.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6c757d', padding: '15px' }}>No chats yet. Start a conversation!</p>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#e5ddd5' }}>
        {selectedUser ? (
          <>
            <div style={{ padding: '15px', background: '#007bff', color: '#fff', textAlign: 'center' }}>
              <h2 style={{ margin: 0 }}>{selectedUser.fullName}</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  style={{
                    textAlign: msg.senderId?._id === adminId ? 'right' : 'left',
                    margin: '10px 0'
                  }}
                >
                  <span style={{
                    padding: '10px 15px',
                    background: msg.senderId?._id === adminId ? '#dcf8c6' : '#edf2f7',
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
            Select a user to start chatting! 💬
          </div>
        )}
      </div>
    </div>
  );
}
