import React from 'react';

function About() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        About Us
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg text-gray-700 mb-4">
          We're dedicated to creating amazing web experiences using modern technologies
          and best practices.
        </p>
        <p className="text-lg text-gray-700">
          This application demonstrates a clean, modular architecture with
          component-based development and responsive design.
        </p>
      </div>
    </div>
  );
}

export default About;