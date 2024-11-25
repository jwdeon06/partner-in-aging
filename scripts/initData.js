import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initialProducts = [
  {
    name: "Basic Care Package",
    description: "Essential caregiving supplies including personal care items, safety equipment, and basic medical supplies.",
    price: 49.99,
    images: ["https://picsum.photos/seed/basic/400/300"],
    category: "Product",
    subcategory: "Care Packages",
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Advanced Care Kit",
    description: "Comprehensive caregiving kit with premium supplies, monitoring devices, and comfort items.",
    price: 99.99,
    images: ["https://picsum.photos/seed/advanced/400/300"],
    category: "Product",
    subcategory: "Care Packages",
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Caregiver Consultation",
    description: "One-hour personal consultation with an experienced caregiver.",
    price: 75.00,
    images: ["https://picsum.photos/seed/consult/400/300"],
    category: "Service",
    subcategory: "Consultations",
    stock: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const initialPosts = [
  {
    title: "Getting Started with Caregiving",
    content: "A comprehensive guide for new caregivers...",
    categoryId: "general",
    tags: ["beginners", "basics", "guide"],
    published: true,
    authorId: "admin",
    authorName: "Admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Self-Care Tips for Caregivers",
    content: "Taking care of yourself while caring for others...",
    categoryId: "wellness",
    tags: ["self-care", "wellness", "health"],
    published: true,
    authorId: "admin",
    authorName: "Admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function initializeData() {
  try {
    // Clear existing products
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    for (const doc of productsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Add new products
    for (const product of initialProducts) {
      await addDoc(productsRef, product);
    }
    console.log('Products initialized');

    // Clear existing posts
    const postsRef = collection(db, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    for (const doc of postsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Add new posts
    for (const post of initialPosts) {
      await addDoc(postsRef, post);
    }
    console.log('Posts initialized');

  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Run the initialization
initializeData();