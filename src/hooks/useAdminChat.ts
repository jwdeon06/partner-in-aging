import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useAdminChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to messages
    const q = query(
      collection(db, 'chats', user.uid, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'chats', user.uid, 'messages'), {
        content,
        role: 'user',
        createdAt: new Date().toISOString(),
        userId: user.uid
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
}