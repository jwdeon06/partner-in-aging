import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const initialItems = [
  // Products
  {
    name: "Basic Care Package",
    description: "Essential caregiving supplies including personal care items, safety equipment, and basic medical supplies.",
    price: 49.99,
    images: ["https://picsum.photos/400/300"],
    category: "Products",
    subcategory: "Care Packages",
    stock: 50,
    stripeProductId: "prod_basic",
    stripePriceId: "price_basic"
  },
  {
    name: "Advanced Care Kit",
    description: "Comprehensive caregiving kit with premium supplies, monitoring devices, and comfort items.",
    price: 99.99,
    images: ["https://picsum.photos/400/300"],
    category: "Products",
    subcategory: "Care Packages",
    stock: 30,
    stripeProductId: "prod_advanced",
    stripePriceId: "price_advanced"
  },
  {
    name: "Caregiver's Guide Book",
    description: "Comprehensive guide for caregivers with expert advice and practical tips.",
    price: 29.99,
    images: ["https://picsum.photos/400/300"],
    category: "Products",
    subcategory: "Books",
    stock: 100,
    stripeProductId: "prod_guide",
    stripePriceId: "price_guide"
  },
  // Services
  {
    name: "Caregiver Consultation",
    description: "One-hour personal consultation with an experienced caregiver.",
    price: 75.00,
    images: ["https://picsum.photos/400/300"],
    category: "Services",
    subcategory: "Consultations",
    stock: 999, // Unlimited/high number for services
    stripeProductId: "serv_consult",
    stripePriceId: "price_consult"
  },
  {
    name: "Care Planning Session",
    description: "Professional care planning session to develop a personalized care strategy.",
    price: 150.00,
    images: ["https://picsum.photos/400/300"],
    category: "Services",
    subcategory: "Planning",
    stock: 999,
    stripeProductId: "serv_planning",
    stripePriceId: "price_planning"
  },
  {
    name: "Monthly Support Group",
    description: "Access to monthly online support group sessions for caregivers.",
    price: 25.00,
    images: ["https://picsum.photos/400/300"],
    category: "Services",
    subcategory: "Support Groups",
    stock: 999,
    stripeProductId: "serv_support",
    stripePriceId: "price_support"
  }
];

export async function initializeProducts() {
  try {
    const productsCollection = collection(db, 'products');
    
    for (const item of initialItems) {
      await addDoc(productsCollection, {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('Products and services initialized successfully');
  } catch (error) {
    console.error('Error initializing products and services:', error);
    throw error;
  }
}