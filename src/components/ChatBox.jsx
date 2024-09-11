import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faComments, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FaPaperclip } from 'react-icons/fa';
import './ChatBox.css';
import { FetchUsers } from '../ApiService/SignupApiService';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';

const ChatBox = ({ show, handleClose }) => {
    const [users, setUsers] = useState([]);
    const [clickedOnPeople, setClickedOnPeople] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [clickedBack, setClickedBack] = useState(true);
    const [recentChats, setRecentChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [selectedUserStatus, setSelectedUserStatus] = useState('');
    const [messages, setMessages] = useState([]);
    const dropdownRef = useRef(null);
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        async function fetchAllUsers() {
            try {
                const userList = await FetchUsers();
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        }
        fetchAllUsers();

        const userId = localStorage.getItem("userId");
        axios.get(`/ChatUrl/chat/recent-chats/${userId}`)
            .then(response => {
                const fetchedRecentChats = response.data;
                // Merge unread counts from separately fetched data
                axios.get(`/ChatUrl/chat/unread-count/${userId}`)
                    .then(unreadCountsResponse => {
                        const unreadCounts = unreadCountsResponse.data;
                        const updatedChats = fetchedRecentChats.map(chat => ({
                            ...chat,
                            unreadCount: unreadCounts[chat.recipientId] || 0
                        }));
                        setRecentChats(updatedChats);
                    })
                    .catch(error => {
                        console.error('Error fetching unread counts:', error);
                    });

                setClickedBack(false);
            })
            .catch(error => {
                console.error('Error fetching recent chats:', error);
            });

    }, [show, clickedBack]);

    useEffect(() => {
        if (show) {
            const socket = new SockJS('/ChatUrl/chat/ws');
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe(`/user/${localStorage.getItem("userId")}/queue/messages`, async (message) => {
                    const parsedMessage = JSON.parse(message.body);

                    // Update messages for the selected user
                    if (parsedMessage.senderId === selectedUser || parsedMessage.recipientId === selectedUser) {
                        setMessages(prevMessages => [...prevMessages, parsedMessage]);

                        // Mark messages as read when received in an open chat
                        const currentUserId = localStorage.getItem("userId");
                        await axios.post(`/ChatUrl/chat/markAsRead`, { senderId: selectedUser, recipientId: currentUserId });
                    }

                    // Update recent chats
                    setRecentChats(prevChats => {
                        const existingChatIndex = prevChats.findIndex(chat =>
                            chat.recipientId === parsedMessage.senderId || chat.recipientId === parsedMessage.recipientId
                        );

                        if (existingChatIndex !== -1) {
                            const updatedChats = [...prevChats];
                            const updatedChat = {
                                ...updatedChats[existingChatIndex],
                                unreadCount: parsedMessage.recipientId === selectedUser ? 0 : updatedChats[existingChatIndex].unreadCount + 1
                            };
                            updatedChats.splice(existingChatIndex, 1);
                            return [updatedChat, ...updatedChats];
                        } else {
                            // If chat does not exist, create a new entry
                            return [{
                                recipientId: parsedMessage.senderId,
                                recipient_name: parsedMessage.sender_name,
                                online: parsedMessage.online,
                                unreadCount: parsedMessage.recipientId === selectedUser ? 0 : 1
                            }, ...prevChats];
                        }
                    });
                });


            }, (error) => {
                console.error('Error connecting: ' + error);
            });

            stompClientRef.current = stompClient;

            return () => {
                stompClient.disconnect(() => {
                    console.log('Disconnected');
                });
            };
        }
    }, [show, selectedUser]);

    // const renderMessageStatus = (msg) => {
    //     if (msg.isRead) {
    //         return <span className="tick blue-tick">✔✔</span>;
    //     } else if (msg.online) {
    //         return <span className="tick double-tick">✔✔</span>;
    //     } else {
    //         return <span className="tick single-tick">✔</span>;
    //     }
    // };



    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setClickedOnPeople(false);
            }
        }

        if (clickedOnPeople) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [clickedOnPeople]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleAllUser = () => {
        setClickedOnPeople(true);
    };

    const handleCollapse = () => {
        setCollapsed(!collapsed);
        console.log(`Collapsed state changed: ${!collapsed}`);
    };

    const connectStomp = (user) => {
        if (!stompClientRef.current) {
            const socket = new SockJS('/ChatUrl/chat/ws');
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, (frame) => {
                stompClient.subscribe(`/user/${localStorage.getItem("userId")}/queue/messages`, (message) => {
                    const parsedMessage = JSON.parse(message.body);
                    if (parsedMessage.senderId === selectedUser || parsedMessage.recipientId === selectedUser) {
                        setMessages(prevMessages => [...prevMessages, parsedMessage]);
                    }
                });
            }, (error) => {
                console.error('Error connecting: ' + error);
            });

            stompClientRef.current = stompClient;
        }
    };

    const handleUserClick = async (userId) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(userId);
        setSelectedUserName(user ? user.name : '');
        setSelectedUserStatus(user ? user.online : '');
        connectStomp({ id: userId });

        const currentUserId = localStorage.getItem("userId");
        try {
            const response = await axios.get(`/ChatUrl/chat/messages/${currentUserId}/${userId}`);
            setMessages(response.data);

            // Mark messages as read
            await axios.post(`/ChatUrl/chat/markAsRead`, { senderId: userId, recipientId: currentUserId });

            // Update recent chats locally
            setRecentChats(prevChats => prevChats.map(chat => {
                if (chat.recipientId === userId) {
                    return { ...chat, unreadCount: 0 };
                }
                return chat;
            }));
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }

        setClickedOnPeople(false);
    };

    const handleRecentChatClick = async (chat) => {
        setSelectedUser(chat.recipientId);
        setSelectedUserName(chat.recipient_name);
        setSelectedUserStatus(chat ? chat.online : '');

        connectStomp({ id: chat.recipientId });

        const currentUserId = localStorage.getItem("userId");
        try {
            const response = await axios.get(`/ChatUrl/chat/messages/${currentUserId}/${chat.recipientId}`);
            setMessages(response.data);

            // Mark messages as read
            await axios.post(`/ChatUrl/chat/markAsRead`, { senderId: chat.recipientId, recipientId: currentUserId });

            // Update recent chats locally
            setRecentChats(prevChats => prevChats.map(c => {
                if (c.recipientId === chat.recipientId) {
                    return { ...c, unreadCount: 0 };
                }
                return c;
            }));
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const sendMessage = async (messageContent) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            const senderId = localStorage.getItem("userId");
            const recipientId = selectedUser;
            const chatMessage = {
                senderId,
                recipientId,
                content: messageContent,
                chatId: `${senderId}_${recipientId}`
            };
            stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));
            setMessages(prevMessages => [...prevMessages, chatMessage]);

            // Update recent chats locally to avoid duplicates
            setRecentChats(prevChats => {
                const existingChatIndex = prevChats.findIndex(chat => chat.recipientId === recipientId || chat.senderId === recipientId);
                if (existingChatIndex >= 0) {
                    const updatedChats = [...prevChats];
                    updatedChats.splice(existingChatIndex, 1);
                    return [chatMessage, ...updatedChats];
                } else {
                    return [chatMessage, ...prevChats];
                }
            });
        }
    };

    const getInitials = (name) => {
        if (!name) return '';
        const [firstName, lastName] = name.split(' ');
        return (firstName[0] + (lastName ? lastName[0] : '')).toUpperCase();
    };

    const handleBack = () => {
        setSelectedUser(null);
        setSelectedUserName('');
        setMessages([]);
        setClickedBack(true);
    };

    const handleClosebutton = () => {
        handleClose();
        setCollapsed(false);
        setClickedOnPeople(false);
        setSelectedUser(false);
    }

    const [attachments, setAttachments] = useState([]);

    const handleFileChange = (e) => {
        setAttachments([...e.target.files]);
    };

    return (
        <div className={`chat-popup ${show ? 'show' : ''}  ${collapsed ? 'collapsed-box' : ''} `} id="chatForm">
            <div className="form-container">
                <div className={`box box-primary direct-chat direct-chat-primary `}>
                    <div className="box-header with-border">
                        <h6 className="box-title">
                            {selectedUser ? (
                                <>
                                    <span onClick={handleBack} className="back-arrow" >
                                        <FontAwesomeIcon icon={faArrowLeft} title="Back" />
                                    </span>
                                    <span className="selected-user-name">{selectedUserName}</span>

                                    <div className="status-container">
                                        <span className={`status-text-label ${selectedUserStatus ? 'onlineUser' : 'offlineUser'}`}>
                                            {selectedUserStatus ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </>
                            ) : <h4>Chat Box</h4>}
                        </h6>
                        <div className="box-tools pull-right">
                            <button type="button" className="btn btn-box-tool" onClick={handleCollapse}>
                                <FontAwesomeIcon icon={faMinus} title="Minimize" />
                            </button>
                            <button type="button" className="btn btn-box-tool" data-toggle="tooltip" onClick={handleAllUser} title="People" data-widget="chat-pane-toggle">
                                <FontAwesomeIcon icon={faComments} />
                            </button>
                            {clickedOnPeople && (
                                <div ref={dropdownRef} className="user-dropdown">
                                    <ul>
                                        {users.map((user, index) => (
                                            <li key={index} onClick={() => handleUserClick(user.id)} className="chat-item zebra-stripe">
                                                <div className="chat-info">
                                                    <strong>{user.name}</strong>
                                                    <span className={`status-dot ${user.online ? 'online' : 'offline'}`}></span>

                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button type="button" className="btn btn-box-tool" data-widget="remove" onClick={handleClosebutton}>
                                <FontAwesomeIcon icon={faTimes} title="Close" />
                            </button>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="direct-chat-messages">
                            {selectedUser ? (
                                messages.map((msg, index) => (
                                    <div key={index} className={`direct-chat-msg ${msg.senderId === localStorage.getItem("userId") ? 'right' : 'left'}`}>
                                        <div className="direct-chat-info clearfix">
                                            <span className={`direct-chat-name ${msg.senderId === localStorage.getItem("userId") ? 'float-right' : 'float-left'}`}>
                                                {msg.senderId === localStorage.getItem("userId") ? 'You' : msg.sender_name}
                                            </span>
                                        </div>
                                        <div className="direct-chat-text">{msg.content}</div>
                                        {/* <span className="message-status">
                                            {msg.senderId === localStorage.getItem("userId") && renderMessageStatus(msg)}
                                        </span> */}
                                    </div>
                                ))
                            ) : (
                                recentChats.map((chat, index) => (
                                    <div key={index} onClick={() => handleRecentChatClick(chat)} className="chat-item">
                                        <div className="chat-avatar">{getInitials(chat.recipient_name)}</div>
                                        <div className="chat-info">
                                            <strong>{chat.recipient_name}</strong>
                                            <span className={`status-dot ${chat.online ? 'online' : 'offline'}`}></span>

                                            {chat.unreadCount > 0 && (
                                                <span className="unread-count">
                                                    {chat.unreadCount} new
                                                </span>
                                            )}

                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} /> {/* Ref to track the end of messages */}
                        </div>

                    </div>
                    {selectedUser && (
                        <div className="input-group mt-3">
                            <div className="textarea-container">
                                <textarea
                                    name="message"
                                    rows="1"
                                    cols="5"
                                    placeholder="Type Message ..."
                                    className="form-control"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // Prevents the default behavior of Enter key
                                            sendMessage(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />


                                <label htmlFor="file-input" style={{ display: 'none', cursor: 'pointer', position: 'absolute', right: '10px', top: '47%', transform: 'translateY(-47%)' }}>
                                    <FaPaperclip className="attachment-icon" title='Attachment' />
                                </label>
                                <input
                                    type="file"
                                    id="file-input"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </div>


                            <span className="input-group-btn" style={{ float: 'right' }}>
                                <button type="submit" className="btn btn-primary msg-btn" onClick={() => {
                                    const messageInput = document.querySelector('textarea[name="message"]');
                                    sendMessage(messageInput.value);
                                    messageInput.value = '';
                                }}>Send</button>
                            </span>
                        </div>

                    )}
                </div>

            </div>

        </div>
    );
};

export default ChatBox;
