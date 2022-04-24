import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Config } from './config';

const firebase = initializeApp({
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
});

const firestore = getFirestore(firebase);
const collectionId = 'spotify-backend-client';

export class Firestore
{
  static collectionReference()
  {
    return collection(firestore, collectionId);
  }

  static documentReference(documentId: string)
  {
    return doc(firestore, collectionId, documentId);
  }

  static async getDocument<T>(documentId: string)
  {
    const document = Firestore.documentReference(documentId);
    const doc = await getDoc(document);
    return doc.data() as T;
  }

  static async setDocument<T>(documentId: string, data: unknown)
  {
    await setDoc(Firestore.documentReference(documentId), data);
    return Firestore.getDocument<T>(documentId);
  }

  static async updateDocument<T>(documentId: string, data: Partial<unknown>)
  {
    await setDoc(Firestore.documentReference(documentId), data, { merge: true });
    return Firestore.getDocument<T>(documentId);
  }
}
