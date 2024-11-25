import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createThread, sendMessage } from '../services/openai';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import toast from 'react-hot-toast';

function AIGuide() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const messagesEndRef = React.useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const initThread = async () => {
      try {
        const newThreadId = await createThread();
        setThreadId(newThreadId);
      } catch (error) {
        console.error('Error initializing AI Guide:', error);
        toast.error('Failed to initialize AI Guide. Please try again later.');
      }
    };
    initThread();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim() || !threadId || isLoading) return;

    const userMessage = {
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(threadId, content);
      
      const assistantMessage = {
        role: 'assistant',
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!threadId) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Caregiving AI Guide
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Your personal AI assistant for caregiving guidance and support. Ask any questions about caregiving, and get immediate assistance.
        </p>
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 mb-2">
              Create an account to save your conversations and get personalized assistance.
            </p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-block px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="text-gray-500 italic">AI Guide is thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>

      {!user && messages.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p className="mb-2">
            Note: Your conversation history will be lost when you leave or refresh the page.
          </p>
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Create an account to save your conversations
          </Link>
        </div>
      )}
    </div>
  );
}

export default AIGuide;