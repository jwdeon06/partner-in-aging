import React from 'react';
import { LibraryItem } from '../../types';

interface LibraryCardProps {
  item: LibraryItem;
  onEdit: () => void;
  onDelete: () => void;
  showActions: boolean;
}

function LibraryCard({ item, onEdit, onDelete, showActions }: LibraryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 mb-3">{item.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {new Date(item.date).toLocaleDateString()}
          </div>
          {showActions && (
            <div className="space-x-2">
              <button
                onClick={onEdit}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LibraryCard;