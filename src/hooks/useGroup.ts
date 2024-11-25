import { useState, useEffect } from 'react';
import { doc, collection, query, orderBy, getDocs, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface NewPost {
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export function useGroup(groupId: string) {
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      // Load group details
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      if (!groupDoc.exists()) {
        setGroup(null);
        return;
      }
      
      setGroup({ id: groupDoc.id, ...groupDoc.data() } as Group);

      // Load posts
      const q = query(
        collection(db, 'groups', groupId, 'posts'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const loadedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];

      setPosts(loadedPosts);
    } catch (error) {
      console.error('Error loading group:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (post: NewPost) => {
    const docRef = await addDoc(collection(db, 'groups', groupId, 'posts'), post);
    return docRef.id;
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, 'groups', groupId, 'posts', postId));
    setPosts(posts.filter(p => p.id !== postId));
  };

  return {
    group,
    posts,
    loading,
    addPost,
    deletePost,
    refreshGroup: loadGroup
  };
}