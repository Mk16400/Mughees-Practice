

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA59UP23IDv0BzCCG_cF9Xn3h5L0NyWeuM",
  authDomain: "cedric-8cb7d.firebaseapp.com",
  databaseURL: "https://cedric-8cb7d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cedric-8cb7d",
  storageBucket: "cedric-8cb7d.appspot.com",
  messagingSenderId: "24571724260",
  appId: "1:24571724260:web:6e1978e3fead7d6c7587f1",
  measurementId: "G-MZQTP755HK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
