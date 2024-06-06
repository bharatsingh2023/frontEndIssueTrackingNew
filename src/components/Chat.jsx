import React, { useState, useEffect, useRef } from 'react';

import { w3cwebsocket as W3CWebSocket } from 'websocket';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const client = useRef(null);

    useEffect(() => {
        client.current = new W3CWebSocket('/chat-websocket');

        client.current.onopen = () => {
            console.log('WebSocket connected');
            fetchUsers();
        };

        client.current.onmessage = (message) => {
            const messageData = JSON.parse(message.data);
            setMessages(prevMessages => [...prevMessages, messageData]);
        };

        client.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        client.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            client.current.close();
        };
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const sendMessage = () => {
        if (client.current.readyState === client.current.OPEN) {
            const chatMessage = {
                sender: "User",
                content: message,
                type: "CHAT"
            };
            client.current.send(JSON.stringify(chatMessage));
            setMessage("");
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/users/logout?username=User', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.sender}: {msg.content}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                <h3>Users</h3>
                {users.map(user => (
                    <div key={user.id}>{user.username} {user.online ? '(Online)' : ''}</div>
                ))}
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Chat;
