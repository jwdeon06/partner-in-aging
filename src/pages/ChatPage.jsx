import React from 'react';
import Chat from '../components/Chat';

function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Chat with AI Assistant
      </h1>
      <Chat />
    </div>
  );
}

export default ChatPage;