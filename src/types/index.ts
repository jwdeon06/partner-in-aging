import { Timestamp } from 'firebase/firestore';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'member';
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Product' | 'Service';
  subcategory: string;
  images: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
  stripeProductId?: string;
  stripePriceId?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId?: string;
  tags: string[];
  published: boolean;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
};

export type CarePlan = {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  authorId: string;
  authorName: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
  recommendedFor: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tasks: CarePlanTask[];
};

export type CarePlanTask = {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
  completed?: boolean;
  dueDate?: string;
};

export type UserCarePlan = {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  progress: number;
  tasks: UserCarePlanTask[];
  notes: string;
  lastUpdated: string;
};

export type UserCarePlanTask = CarePlanTask & {
  completed: boolean;
  completedDate?: string;
};

export interface LibraryCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}