import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const SCHEMA_DOC_ID = 'userProfileSchema';

export async function getSchema() {
  try {
    const schemaRef = doc(db, 'schemas', SCHEMA_DOC_ID);
    const schemaSnap = await getDoc(schemaRef);
    
    if (!schemaSnap.exists()) {
      // Return default schema if none exists
      return {
        fields: [
          {
            id: 'fullName',
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true
          },
          {
            id: 'phoneNumber',
            name: 'phoneNumber',
            label: 'Phone Number',
            type: 'tel',
            required: false
          },
          {
            id: 'caregiverRole',
            name: 'caregiverRole',
            label: 'Caregiver Role',
            type: 'select',
            required: true,
            options: ['Family Caregiver', 'Professional Caregiver', 'Both', 'Other']
          }
        ]
      };
    }
    
    return schemaSnap.data();
  } catch (error) {
    console.error('Error getting schema:', error);
    toast.error('Failed to load schema');
    throw error;
  }
}

export async function updateSchema(schema) {
  try {
    const schemaRef = doc(db, 'schemas', SCHEMA_DOC_ID);
    await setDoc(schemaRef, schema);
    toast.success('Schema updated successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
    toast.error('Failed to update schema');
    throw error;
  }
}