
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';


const participantCollection = collection(db, 'participants');

export const saveParticipant = async (formData, paymentData = null) => {
  try {
 
    const participantId = `P${Date.now()}`;

   
    const finalData = {
      participantId,
      ...formData,
      createdAt: new Date().toISOString(),
      ...(paymentData ? { payment: paymentData } : {}), 
    };

  
    await setDoc(doc(db, 'participants', participantId), finalData);

    console.log('Participant saved with ID:', participantId);
    return participantId;
  } catch (e) {
    console.error('Error saving participant:', e);
    throw e;
  }
};


export const getAllParticipants = async () => {
  try {
    const snapshot = await getDocs(participantCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error('Error fetching participants:', e);
    throw e;
  }
};


export const updateParticipant = async (participantId, updatedData) => {
  try {
    const docRef = doc(db, 'participants', participantId);
    await updateDoc(docRef, updatedData);
    console.log(`Participant ${participantId} updated successfully.`);
  } catch (e) {
    console.error('Error updating participant:', e);
    throw e;
  }
};


export const deleteParticipant = async (participantId) => {
  try {
    const docRef = doc(db, 'participants', participantId);
    await deleteDoc(docRef);
    console.log(`Participant ${participantId} deleted successfully.`);
  } catch (e) {
    console.error('Error deleting participant:', e);
    throw e;
  }
};
