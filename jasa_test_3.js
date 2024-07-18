require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getStorage, ref, listAll } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Firebase configuration from .env file
const firebaseConfig = {
    apiKey: process.env.EXPRESS_APP_API_KEY,
    authDomain: process.env.EXPRESS_APP_AUTH_DOMAIN,
    projectId: process.env.EXPRESS_APP_PROJECT_ID,
    storageBucket: process.env.EXPRESS_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPRESS_APP_MESSAGING_SENDER_ID,
    appId: process.env.EXPRESS_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const outputPath = path.join(__dirname, 'folder_details.json');

async function fetchFolderDetails() {
    const folderRef = ref(storage, '');
    const list = await listAll(folderRef);

    const folderDetails = list.prefixes.map(prefix => ({
        name: prefix.name,
        url: `gs://${storage._bucket}/${prefix.fullPath}`,
        model: "",
        modelCreationTime: ""
    }));

    return folderDetails;
}

async function main() {
    try {
        // Clear the JSON file before writing new data
        fs.writeFileSync(outputPath, JSON.stringify([], null, 2));

        const folderDetails = await fetchFolderDetails();
        console.log('Folders:', folderDetails);

        fs.writeFileSync(outputPath, JSON.stringify(folderDetails, null, 2));
        console.log('folder_details.json has been updated.');
    } catch (error) {
        console.error('Error fetching folder details:', error);
    }
}

// Call the main function
main();
