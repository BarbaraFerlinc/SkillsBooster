import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineWechatWork } from "react-icons/ai";
import api from '../services/api';

function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const assistantRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                assistantRef.current && !assistantRef.current.contains(event.target) &&
                iconRef.current && !iconRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setMessages([{ text: 'Hello, how can I help you today?', fromUser: false }]);
        }
    };

    const handleSendMessage = async () => {
        if (input.trim() !== '') {
            setMessages([...messages, { text: input, fromUser: true }]);
            setInput('');
            setWaitingForResponse(true);

            try {
                const response = await api.post('/domena/chat-box', { query: input });
                const assistantResponse = { text: response.data, fromUser: false };
                console.log(response.data);
                setMessages(prevMessages => [...prevMessages, assistantResponse]);
            } catch (error) {
                console.error("Error:", error.response ? error.response.data : error.message);
                const errorMessage = { text: 'Sorry, something went wrong.', fromUser: false };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
            } finally {
                setWaitingForResponse(false);
            }
        }
    };

    return (
        <div>
            <div
                ref={iconRef}
                className="fixed bottom-16 right-16 z-50 p-3 bg-indigo-600 text-white rounded-full cursor-pointer shadow-lg"
                onClick={toggleChat}
            >
                <AiOutlineWechatWork size={33} />
            </div>

            {isOpen && (
                <div ref={assistantRef} className="fixed bottom-32 right-16 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">AI Assistant</h2>
                    </div>
                    <div className="p-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-2 ${message.fromUser ? 'text-right' : 'text-left'}`}>
                                <p className={`inline-block p-2 rounded-lg ${message.fromUser ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                                    {message.text}
                                </p>
                            </div>
                        ))}
                        {waitingForResponse && (
                            <div className="text-left">
                                <p className="inline-block p-2 rounded-lg bg-gray-200">
                                    ...
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-l-lg p-2"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-indigo-600 text-white p-2 rounded-r-lg"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AIAssistant;
