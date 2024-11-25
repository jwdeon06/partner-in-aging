import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAtKC2DEb43lcBd8gqxdVPLqJaC5VLqt4",
  authDomain: "partner-in-aging-dev.firebaseapp.com",
  projectId: "partner-in-aging-dev",
  storageBucket: "partner-in-aging-dev.firebasestorage.app",
  messagingSenderId: "33300658646",
  appId: "1:33300658646:web:2b2ae3ab02664189de8c77",
  measurementId: "G-80C9NW6P6R"
};

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

async function initializeProducts() {
  try {
    // First, delete all existing products
    console.log('Deleting existing products...');
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
      console.log(`Deleted product ${doc.id}`);
    }
    
    // Then create new products
    console.log('Creating new products...');
    for (const product of initialProducts) {
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log(`Created ${product.category}: ${product.name} (${docRef.id})`);
    }
    
    console.log('All products initialized successfully');
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

// Run the initialization
initializeProducts();