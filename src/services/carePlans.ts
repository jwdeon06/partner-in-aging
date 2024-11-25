import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy,
  where,
  Timestamp,
  setDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CarePlan, UserCarePlan } from '../types';
import toast from 'react-hot-toast';

const CARE_PLANS_COLLECTION = 'carePlans';
const USER_CARE_PLANS_COLLECTION = 'userCarePlans';

export async function createCarePlan(plan: Omit<CarePlan, 'id'>): Promise<CarePlan> {
  try {
    const docRef = await addDoc(collection(db, CARE_PLANS_COLLECTION), {
      ...plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const newPlan = await getDoc(docRef);
    if (!newPlan.exists()) {
      throw new Error('Failed to create care plan');
    }
    
    return {
      id: docRef.id,
      ...newPlan.data()
    } as CarePlan;
  } catch (error) {
    console.error('Error creating care plan:', error);
    toast.error('Failed to create care plan');
    throw error;
  }
}

export async function updateCarePlan(id: string, updates: Partial<CarePlan>): Promise<void> {
  try {
    const docRef = doc(db, CARE_PLANS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating care plan:', error);
    toast.error('Failed to update care plan');
    throw error;
  }
}

export async function deleteCarePlan(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CARE_PLANS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting care plan:', error);
    toast.error('Failed to delete care plan');
    throw error;
  }
}

export async function getCarePlan(id: string): Promise<CarePlan | null> {
  try {
    const docRef = doc(db, CARE_PLANS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as CarePlan;
  } catch (error) {
    console.error('Error getting care plan:', error);
    return null;
  }
}

export async function getAllCarePlans(): Promise<CarePlan[]> {
  try {
    const q = query(collection(db, CARE_PLANS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CarePlan));
  } catch (error) {
    console.error('Error getting all care plans:', error);
    toast.error('Failed to load care plans');
    return [];
  }
}

export async function getPublishedCarePlans(): Promise<CarePlan[]> {
  try {
    const q = query(
      collection(db, CARE_PLANS_COLLECTION),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CarePlan));
  } catch (error) {
    console.error('Error getting published care plans:', error);
    toast.error('Failed to load care plans');
    return [];
  }
}

export async function assignCarePlan(userId: string, planId: string): Promise<void> {
  try {
    const plan = await getCarePlan(planId);
    if (!plan) {
      throw new Error('Care plan not found');
    }

    const userPlanRef = doc(db, 'users', userId, USER_CARE_PLANS_COLLECTION, planId);
    await setDoc(userPlanRef, {
      planId,
      userId,
      startDate: new Date().toISOString(),
      progress: 0,
      tasks: plan.tasks.map(task => ({
        ...task,
        completed: false
      })),
      notes: '',
      lastUpdated: new Date().toISOString()
    });

    toast.success('Care plan assigned successfully');
  } catch (error) {
    console.error('Error assigning care plan:', error);
    toast.error('Failed to assign care plan');
    throw error;
  }
}

export async function getUserCarePlans(userId: string): Promise<UserCarePlan[]> {
  try {
    const q = query(
      collection(db, 'users', userId, USER_CARE_PLANS_COLLECTION),
      orderBy('startDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserCarePlan));
  } catch (error) {
    console.error('Error getting user care plans:', error);
    toast.error('Failed to load your care plans');
    return [];
  }
}