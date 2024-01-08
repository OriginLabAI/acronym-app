import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { db } from "../config/firebaseConfig"; // ensure you have this path correct
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      
      // Get the user's first and last name from the displayName
      const fullName = user.displayName ? user.displayName.split(' ') : [];
      const firstName = fullName[0] || '';
      const lastName = fullName[fullName.length - 1] || '';
  
      // Set or update additional user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
      }, { merge: true });  // Use merge to prevent overwriting existing fields
  
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // TODO: handle errors appropriately in your app.
      console.error("Google Sign In Error", errorCode, errorMessage);
    }
  };

  const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email, password, firstName, lastName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile with their name (optional)
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Set the user's details in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
      });

      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error; // rethrow to be handled elsewhere
    }
  };


  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, signInWithEmail, signUpWithEmail, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
