import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminChat } from '../../hooks/useAdminChat';
import ChatMessage from '../../components/ChatMessage';
import ChatInput from '../../components/ChatInput';

export default function AdminChat() {
  const { user, userProfile } = useAuth();
  const { messages, sendMessage, loading } = useAdminChat();
  const [adminOnline, setAdminOnline] = useState(false);

  useEffect(() => {
    // TODO: Implement admin online status check
    setAdminOnline(true);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    await sendMessage(content);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-primary-50 border-b border-primary-100">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-primary-900">Expert Chat</h1>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full ${adminOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span className="ml-2 text-sm text-gray-600">
                {adminOnline ? 'Expert Available' : 'Expert Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {loading && (
              <div className="text-gray-500 italic">Expert is typing...</div>
            )}
          </div>

          <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}