import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "partner-in-aging-dev",
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: "112459584290811284469",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-x4mho%40partner-in-aging-dev.iam.gserviceaccount.com"
};

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

const initialProducts = [
  {
    name: "Basic Care Package",
    description: "Essential caregiving supplies including personal care items, safety equipment, and basic medical supplies.",
    price: 49.99,
    images: ["https://picsum.photos/seed/basic/400/300"],
    category: "Products",
    subcategory: "Care Packages",
    stock: 50,
    stripeProductId: "prod_basic",
    stripePriceId: "price_basic",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Advanced Care Kit",
    description: "Comprehensive caregiving kit with premium supplies, monitoring devices, and comfort items.",
    price: 99.99,
    images: ["https://picsum.photos/seed/advanced/400/300"],
    category: "Products",
    subcategory: "Care Packages",
    stock: 30,
    stripeProductId: "prod_advanced",
    stripePriceId: "price_advanced",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Caregiver's Guide Book",
    description: "Comprehensive guide for caregivers with expert advice and practical tips.",
    price: 29.99,
    images: ["https://picsum.photos/seed/guide/400/300"],
    category: "Products",
    subcategory: "Books",
    stock: 100,
    stripeProductId: "prod_guide",
    stripePriceId: "price_guide",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Caregiver Consultation",
    description: "One-hour personal consultation with an experienced caregiver.",
    price: 75.00,
    images: ["https://picsum.photos/seed/consult/400/300"],
    category: "Services",
    subcategory: "Consultations",
    stock: 999,
    stripeProductId: "serv_consult",
    stripePriceId: "price_consult",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Care Planning Session",
    description: "Professional care planning session to develop a personalized care strategy.",
    price: 150.00,
    images: ["https://picsum.photos/seed/planning/400/300"],
    category: "Services",
    subcategory: "Planning",
    stock: 999,
    stripeProductId: "serv_planning",
    stripePriceId: "price_planning",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Monthly Support Group",
    description: "Access to monthly online support group sessions for caregivers.",
    price: 25.00,
    images: ["https://picsum.photos/seed/support/400/300"],
    category: "Services",
    subcategory: "Support Groups",
    stock: 999,
    stripeProductId: "serv_support",
    stripePriceId: "price_support",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function clearExistingProducts() {
  try {
    const snapshot = await db.collection('products').get();
    
    if (snapshot.empty) {
      console.log('No existing products to clear');
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Cleared existing products');
  } catch (error) {
    console.error('Error clearing products:', error);
    throw error;
  }
}

async function initializeProducts() {
  try {
    console.log('Starting product initialization...');
    
    // First clear existing products
    await clearExistingProducts();
    
    // Then add new products
    console.log('Adding new products...');
    const batch = db.batch();
    
    initialProducts.forEach((product) => {
      const docRef = db.collection('products').doc();
      batch.set(docRef, product);
    });
    
    await batch.commit();
    console.log('All products initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing products:', error);
    process.exit(1);
  }
}

// Run the initialization
console.log('Starting script...');
initializeProducts();