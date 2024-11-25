import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function checkAndSetAdmin(email) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, process.env.USER_PASSWORD);
    const uid = userCredential.user.uid;
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log('Current role:', userData.role);
      
      if (userData.role !== 'admin') {
        await updateDoc(userRef, { role: 'admin' });
        console.log('Updated role to admin');
      }
    } else {
      console.log('User document does not exist');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndSetAdmin('jwdeon');