import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Group {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: string;
  memberCount: number;
  postCount: number;
}

interface CreateGroupData {
  name: string;
  description: string;
  isPrivate: boolean;
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const loadedGroups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Group[];

      setGroups(loadedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (data: CreateGroupData) => {
    if (!user) throw new Error('Must be logged in to create a group');

    const groupData = {
      ...data,
      createdAt: new Date().toISOString(),
      createdBy: user.uid,
      memberCount: 1,
      postCount: 0
    };

    const docRef = await addDoc(collection(db, 'groups'), groupData);
    return docRef.id;
  };

  return {
    groups,
    loading,
    createGroup,
    refreshGroups: loadGroups
  };
}