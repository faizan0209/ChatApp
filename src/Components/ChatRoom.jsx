import React, { useState, useEffect } from 'react';
import { database } from './FirebaseConfig';
import { ref, push, onValue } from "firebase/database";
import './Chat.css';

function ChatRoom() {
    const [name, setName] = useState('');
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');

    // Reference to 'chats' node in the database
    const dbRef = ref(database, 'chats');

    // Function to send chat messages
    const setCh = () => {
        if (name && message) { // Ensure both name and message are set
            const chatMessage = { name, message };
            push(dbRef, chatMessage);  // Push message to Firebase
            setMessage('');  // Clear the input field
        }
    };

    // Fetch chat messages in real-time
    useEffect(() => {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedChats = Object.values(data);  // Convert data to array
                setChats(loadedChats);
            }
        });
    }, []);

    return (
        <div className='main'>
            <h1>Chat Room</h1>
            {/* Input for setting user name */}
            <div className="name-input">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            
            <div className="chat-container">
                {chats.map((c, index) => (
                    <div key={index} className={`container ${c.name === name ? 'me' : ''}`}>
                        <p className='chat-box'>
                            <strong>{c.name}</strong>
                            <span>{c.message}</span>
                        </p>
                    </div>
                ))}
            </div>
            <div className="input">
                <input
                    type="text"
                    placeholder='Enter Your Message:'
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <button onClick={setCh}>Send</button>
            </div>
        </div>
    );
}

export default ChatRoom;
