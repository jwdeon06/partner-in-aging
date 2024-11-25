import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

async function updateProductCategories() {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    let updateCount = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const currentCategory = data.category;

      // Convert 'Products' to 'Product' and 'Services' to 'Service'
      let newCategory;
      if (currentCategory === 'Products' || currentCategory === 'products') {
        newCategory = 'Product';
      } else if (currentCategory === 'Services' || currentCategory === 'services') {
        newCategory = 'Service';
      }

      if (newCategory && newCategory !== currentCategory) {
        await updateDoc(doc(db, 'products', docSnap.id), {
          category: newCategory
        });
        console.log(`Updated product ${docSnap.id}: ${currentCategory} -> ${newCategory}`);
        updateCount++;
      }
    }

    console.log(`Update complete. Modified ${updateCount} products.`);
  } catch (error) {
    console.error('Error updating products:', error);
  }
}

// Run the update
updateProductCategories();