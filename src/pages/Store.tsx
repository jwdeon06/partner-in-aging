import React from 'react';

console.log('Store component rendering'); // Debug log

export default function Store() {
  return (
    <div className="p-4 bg-yellow-200">
      <h1 className="text-2xl font-bold text-red-500">TEST STORE PAGE</h1>
      <p className="mt-4">If you see this yellow background and red text, you're seeing the latest version.</p>
    </div>
  );
}