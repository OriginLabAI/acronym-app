//Create a Firebase Authentication Hook (useAuth.js): This custom hook will manage user authentication states using Firebase's onAuthStateChanged method.

import { useEffect, useState } from 'react';
import firebase from '../config/firebaseConfig';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
}
