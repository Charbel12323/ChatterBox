// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"; // ✅ This line was missing!
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnxZishUhccraAKfJtofi4jhhsXMa4zo4",
  authDomain: "chatterbox-9fef1.firebaseapp.com",
  projectId: "chatterbox-9fef1",
  storageBucket: "chatterbox-9fef1.firebasestorage.app",
  messagingSenderId: "139294348994",
  appId: "1:139294348994:web:ef8c05db1d878ed8a34d5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const db = getFirestore(app); // Initialize Firestore database

export { auth, db,googleProvider };