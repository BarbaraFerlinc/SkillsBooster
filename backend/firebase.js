<<<<<<< HEAD
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const {getFirestore}= require('firebase-admin/firestore')

import dotenv from 'dotenv';
=======
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, deleteObject } = require("firebase/storage");
const dotenv = require('dotenv');
>>>>>>> 440de4754bca69dbcc1d7e835b6e234e83f25067

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.EXPRESS_APP_API_KEY,
  authDomain: process.env.EXPRESS_APP_AUTH_DOMAIN,
  projectId: process.env.EXPRESS_APP_PROJECT_ID,
  storageBucket: process.env.EXPRESS_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPRESS_APP_MESSAGING_SENDER_ID,
  appId: process.env.EXPRESS_APP_APP_ID
};

<<<<<<< HEAD
const db= getFirestore()
module.exports={db}

// Initialize Firebase
=======
>>>>>>> 440de4754bca69dbcc1d7e835b6e234e83f25067
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

<<<<<<< HEAD
export default app;


=======
module.exports = { app, storage, ref, uploadBytes, deleteObject };
>>>>>>> 440de4754bca69dbcc1d7e835b6e234e83f25067
