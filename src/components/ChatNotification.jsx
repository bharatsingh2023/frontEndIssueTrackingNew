import { useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const ChatNotification = ({ onUnreadMessageCountChange }) => {
    const stompClientRef = useRef(null);
    const isConnected = useRef(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        let isComponentMounted = true; // To prevent state updates after unmount

        const fetchInitialUnreadCount = async () => {
            try {
                // Fetch recent chats
                const recentChatsResponse = await axios.get(`/ChatUrl/chat/recent-chats/${userId}`);
                const recentChats = recentChatsResponse.data || [];

                // Fetch unread counts
                const unreadCountsResponse = await axios.get(`/ChatUrl/chat/unread-count/${userId}`);
                const unreadCounts = unreadCountsResponse.data || {};

                // Calculate total unread messages
                const totalUnreadCount = recentChats.reduce((total, chat) => {
                    const chatUnreadCount = unreadCounts[chat.recipientId] || 0;
                    return total + chatUnreadCount;
                }, 0);

                if (isComponentMounted) {
                    // Update the unread message count in parent component
                    onUnreadMessageCountChange(totalUnreadCount);
                }
            } catch (error) {
                console.error('Error fetching initial unread counts:', error);
            }
        };

        const setupWebSocketConnection = () => {
            const socket = new SockJS('/ChatUrl/chat/ws');
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, () => {
                console.log('WebSocket connected');
                isConnected.current = true;

                stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
                    const parsedMessage = JSON.parse(message.body);

                    if (!parsedMessage.isRead && isComponentMounted) {
                        onUnreadMessageCountChange((prevCount) => prevCount + 1);
                    }
                });
            }, (error) => {
                console.error('WebSocket connection error:', error);
            });

            stompClientRef.current = stompClient;
        };

        // Initialize: Fetch initial counts and setup WebSocket
        fetchInitialUnreadCount();
        setupWebSocketConnection();

        return () => {
            isComponentMounted = false;
            if (stompClientRef.current && isConnected.current) {
                stompClientRef.current.disconnect(() => {
                    console.log('WebSocket disconnected');
                    isConnected.current = false;
                }, (error) => {
                    console.error('Error during WebSocket disconnect:', error);
                });
            }
        };
    }, [onUnreadMessageCountChange, userId]);

    return null; // This component does not render any UI
};

export default ChatNotification;
