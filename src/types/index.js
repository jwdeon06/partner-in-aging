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