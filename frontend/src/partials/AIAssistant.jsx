import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineWechatWork } from "react-icons/ai"; // Using react-icons for the assistant icon

function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const assistantRef = useRef(null); // Ref for the assistant box

    useEffect(() => {
        // Function to close the assistant box when clicking outside
        const handleClickOutside = (event) => {
            if (assistantRef.current && !assistantRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
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

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            setMessages([...messages, { text: input, fromUser: true }]);
            setInput('');
            // Simulate assistant response
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { text: 'This is a response from AI assistant.', fromUser: false }]);
            }, 1000);
        }
    };

    return (
        <div>
            <div
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
