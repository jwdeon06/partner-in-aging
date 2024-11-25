import { LibraryItem, Category } from '../types';

// Define your categories
export const categories: Category[] = [
  { 
    id: 'technology', 
    name: 'Technology', 
    description: 'Tech-related content',
    slug: 'technology',
    order: 0
  },
  { 
    id: 'business', 
    name: 'Business', 
    description: 'Business and entrepreneurship',
    slug: 'business',
    order: 1
  },
  { 
    id: 'lifestyle', 
    name: 'Lifestyle', 
    description: 'Life and personal development',
    slug: 'lifestyle',
    order: 2
  },
  { 
    id: 'health', 
    name: 'Health', 
    description: 'Health and wellness',
    slug: 'health',
    order: 3
  },
  { 
    id: 'education', 
    name: 'Education', 
    description: 'Learning and teaching',
    slug: 'education',
    order: 4
  },
];

// Initialize with some example items
export let libraryItems: LibraryItem[] = [];

// Function to add a new item
export const addItem = (item: Omit<LibraryItem, 'id'>) => {
  const newItem = {
    ...item,
    id: Date.now().toString(),
    isPublic: true,
  };
  libraryItems = [...libraryItems, newItem];
  return newItem;
};

// Function to edit an existing item
export const editItem = (updatedItem: LibraryItem) => {
  libraryItems = libraryItems.map(item => 
    item.id === updatedItem.id ? updatedItem : item
  );
  return updatedItem;
};

// Function to delete an item
export const deleteItem = (itemId: string) => {
  libraryItems = libraryItems.filter(item => item.id !== itemId);
};