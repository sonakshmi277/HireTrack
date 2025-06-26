import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Message() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const adminEmail = "admin@admin.com";
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user_search?query=admin`);
        const admin = res.data.find(user => user.email === adminEmail);
        if (admin) setAdminId(admin._id);
      } catch (error) {
        console.log("Error fetching admin:", error);
      }
    };
    fetchAdminId();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/user_search?query=${search}`);
        setSearchResults(res.data);
      } catch (error) {
        console.log("Error fetching user names:", error);
      }
    };
    fetchUsers();
  }, [search]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await axios.get(`http://localhost:5000/messages/${selectedUser._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !adminId) return;

    try {
      const res = await axios.post("http://localhost:5000/messages", {
        senderId: adminId,
        receiverId: selectedUser._id,
        text: newMessage
      });
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className='outer-div-mes'>
      <div className='nav-mes'>
        <div className='upper-con-nav'>
          <h2 style={{ paddingLeft: '13px' }}><strong>Messages</strong></h2>
        </div>

        <div className='search-user'>
          <div className='search'>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search users'
            />
          </div>
          <div className='icon-nav'>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>

        {searchResults.map(user => (
          <div
            key={user._id}
            className='chat-Bars'
            onClick={() => setSelectedUser(user)}
          >
            <h3>{user.fullName}</h3>
          </div>
        ))}
      </div>

      <div className='mes-box'>
        {selectedUser && (
          <>
            <div className='chat-header'>
              <h2>{selectedUser.fullName}</h2>
            </div>
            <div className='chat-body' style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.senderId._id === adminId ? 'admin' : 'user'}`}
                  style={{
                    textAlign: msg.senderId._id === adminId ? 'right' : 'left',
                    margin: '10px 0'
                  }}
                >
                  <span style={{ padding: '8px', background: '#f1f1f1', borderRadius: '10px' }}>{msg.text}</span>
                </div>
              ))}
            </div>
            <div className='chat-input' style={{ display: 'flex', padding: '10px' }}>
              <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Type your message'
                style={{ flex: 1, padding: '10px' }}
              />
              <button onClick={sendMessage} style={{ marginLeft: '10px', padding: '10px' }}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
