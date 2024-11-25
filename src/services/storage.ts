import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../config/firebase';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

export async function uploadImage(file: File): Promise<string> {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to upload images');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `images/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    if (error.code === 'storage/unauthorized') {
      toast.error('You do not have permission to upload images');
    } else {
      toast.error('Failed to upload image');
    }
    throw error;
  }
}