
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} ProfilePlus. All rights reserved.</p>
        <p className="text-sm">Create your professional online presence.</p>
      </div>
    </footer>
  );
};
