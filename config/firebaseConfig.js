import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import for Firebase Authentication


const firebaseConfig = {
    apiKey: "AIzaSyBQRvZ9cOHE23_pc8YvnIuMbqps86OkxcI",
    authDomain: "acronym-app-84136.firebaseapp.com",
    projectId: "acronym-app-84136",
    storageBucket: "acronym-app-84136.appspot.com",
    messagingSenderId: "397175619906",
    appId: "1:397175619906:web:53a764be2d69caf17e88db",
    measurementId: "G-NZYZQH8XHV"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
