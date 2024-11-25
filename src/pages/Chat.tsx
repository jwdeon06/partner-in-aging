import React from 'react';
import Chat from '../components/Chat';

function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">
          Caregiving Guide
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get immediate assistance with caregiving questions, resources, and support. Our AI guide is here to help you navigate your caregiving journey.
        </p>
      </div>
      <Chat />
    </div>
  );
}

export default ChatPage;