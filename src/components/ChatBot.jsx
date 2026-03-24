import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function ChatBot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your health assistant. How can I help you today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = {
            id: Date.now(),
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const userId = user?.userId || null;
            // Use the Vite proxy path
            const response = await axios.post('/api/chatbot_proxy.php', {
                user_id: userId,
                message: input
            });

            const botMsg = {
                id: Date.now() + 1,
                text: response.data.reply || "I'm sorry, I couldn't process that request.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Failed to connect to assistant. Please check your internet.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <button 
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Chat with Assistant"
            >
                <span className="material-icons-outlined">
                    {isOpen ? 'close' : 'chat'}
                </span>
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <span className="material-icons-outlined">smart_toy</span>
                            </div>
                            <div>
                                <h3>Health Assistant</h3>
                                <span className="status-online">Online</span>
                            </div>
                        </div>
                        <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                            <span className="material-icons-outlined">remove</span>
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                                <div className="message-bubble">
                                    <p>{msg.text}</p>
                                    <span className="message-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-wrapper bot">
                                <div className="message-bubble typing">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-area" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type your message..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={!input.trim() || isLoading}>
                            <span className="material-icons-outlined">send</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ChatBot;
