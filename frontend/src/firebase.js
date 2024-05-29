import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const {getFirestore}= require('firebase-admin/firestore')

import dotenv from 'dotenv';

dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPRESS_APP_API_KEY,
  authDomain: process.env.EXPRESS_APP_AUTH_DOMAIN,
  projectId: process.env.EXPRESS_APP_PROJECT_ID,
  storageBucket: process.env.EXPRESS_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPRESS_APP_MESSAGING_SENDER_ID,
  appId: process.env.EXPRESS_APP_APP_ID
};

const db= getFirestore()
module.exports={db}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;


