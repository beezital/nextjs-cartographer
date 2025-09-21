// https://firebase.google.com/docs/web/setup
// https://stackoverflow.com/questions/48492047/where-do-i-initialize-firebase-app-in-react-application (to confirm copilot suggestion)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { MessagePayload, deleteToken, getMessaging, getToken, onMessage } from 'firebase/messaging';

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

const vapidKey = process.env.NEXT_PUBLIC_VAPID || "";

function getClientMessaging() {
  // Lazy initialization (thx Claude Sonnet 4)
  if (typeof window !== 'undefined') {
    return getMessaging(app);
  }
  console.log("getClientMessaging: window is undefined");
  return null;
}

function requestPermission() {
  // Add client-side check (thx Claude Sonnet 4)
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    console.log("requestPermission: window or Notification is undefined");
    return null;
  }

  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve a registration token for use with FCM.
      // In many cases once an app has been granted notification permission,
      // it should update its UI reflecting this.
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
}

async function getMessagingToken(): Promise<string | null> {
  // Add client-side check (thx Claude Sonnet 4)
  if (typeof window === 'undefined') return null;

  try {
    const messaging = getClientMessaging();
    if (!messaging) return null;

    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      return currentToken;
    } else {
      // Show permission request.
      console.log('No registration token available. Request permission to generate one.');
      // Show permission UI.
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
}


export { app, auth, requestPermission, getMessagingToken };
