import { useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, getDoc, setDoc, query, where, doc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider);
    await signInWithRedirect(auth, provider)

    // console.log("User signed in");
    // // Query the database to see if the user exists
    // const userRef = db.collection('users').doc(user.uid);
    // const doc = await userRef.get();
    // console.log(doc);
    // if (!doc.exists) {
    //   console.log('No such document!');
    //   // If the user does not exist, create a new user
    //   await userRef.set({
    //     uid: user.uid,
    //     displayName: user.displayName,
    //     email: user.email,
    //     photoURL: user.photoURL,
    //   });
    // }
    // else {
    //   console.log('Document data:', doc.data());
    // }

  };

  const logOut = () => {
    signOut(auth)
  }

  async function getUsers() {
    // Create data
    // NOTE: The "cities" collection didn't need to be created in advance
    // const citiesRef = collection(db, 'cities');

    // await setDoc(doc(citiesRef, "SF"), {
    //     name: "San Francisco", state: "CA", country: "USA",
    //     capital: false, population: 860000,
    //     regions: ["west_coast", "norcal"] });
    // await setDoc(doc(citiesRef, "LA"), {
    //     name: "Los Angeles", state: "CA", country: "USA",
    //     capital: false, population: 3900000,
    //     regions: ["west_coast", "socal"] });
    // await setDoc(doc(citiesRef, "DC"), {
    //     name: "Washington, D.C.", state: null, country: "USA",
    //     capital: true, population: 680000,
    //     regions: ["east_coast"] });
    // await setDoc(doc(citiesRef, "TOK"), {
    //     name: "Tokyo", state: null, country: "Japan",
    //     capital: true, population: 9000000,
    //     regions: ["kanto", "honshu"] });
    // await setDoc(doc(citiesRef, "BJ"), {
    //     name: "Beijing", state: null, country: "China",
    //     capital: true, population: 21500000,
    //     regions: ["jingjinji", "hebei"] });

    // Read data
    const docRef = doc(db, "cities", "asdf");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    }
    else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }


  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log('User', currentUser)
      console.log('User', currentUser?.uid);

      // This works great for getting the user's data and creating it if it doesn't yet exist.
      // I should extend this so that there's a avatar config subcollection thing (look at the test user I created)
      // There are also ways to do custom types, which could be useful for the avatar config (see docs)
      // Tomorrow I should start looking at folding this in to the existing app, see how much of this context stuff I 
      // really need to port over. 
      // At some point, I should start thinking about the UI as well.
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        console.log("User document data:", userDocSnap.data());
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
        console.log('User created');
      }

      getUsers();

    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
