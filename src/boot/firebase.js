import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKMDZSWA9Ru4yfA0cFciPbEMDCaShGcjU",
  authDomain: "twatter-26a8d.firebaseapp.com",
  projectId: "twatter-26a8d",
  storageBucket: "twatter-26a8d.appspot.com",
  messagingSenderId: "922433461201",
  appId: "1:922433461201:web:ea0bc49f4d846bd4001ef0",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, db };