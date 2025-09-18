// https://firebase.google.com/docs/web/setup
// https://stackoverflow.com/questions/48492047/where-do-i-initialize-firebase-app-in-react-application (to confirm copilot suggestion)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX8UamBQeZiFZ6MqFKI-qOGxc7hSSxdRg",
  authDomain: "beezimap-dev.firebaseapp.com",
  projectId: "beezimap-dev",
  storageBucket: "beezimap-dev.firebasestorage.app",
  messagingSenderId: "968728684510",
  appId: "1:968728684510:web:795197755788f0e11cdf4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
