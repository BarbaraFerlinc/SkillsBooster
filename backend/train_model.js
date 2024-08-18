require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, listAll, getDownloadURL } = require('firebase/storage');

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

const tempDataFilePath = path.join(__dirname, 'temp_data.json');
const folderDetailsPath = path.join(__dirname, 'folder_details.json');

// Function to fetch URLs from Firebase
async function fetchFileUrls(folderName) {
    const folderRef = ref(storage, folderName);
    const list = await listAll(folderRef);

    const fileUrls = await Promise.all(list.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { ime: itemRef.name, url: url };
    }));

    return fileUrls;
}

// Function to process the folder
async function processFolder(folderName) {
    try {
        const datoteke = await fetchFileUrls(folderName);
        console.log('Pridobljene datoteke:', datoteke);

        // Save file information to a temporary JSON file
        fs.writeFileSync(tempDataFilePath, JSON.stringify(datoteke, null, 2));
        console.log('temp_data.json je bil posodobljen.');

        // Prepare the FormData object for the file upload
        const formData = new FormData();
        formData.append('temp_file', fs.createReadStream(tempDataFilePath));

        // Send a POST request to the FastAPI endpoint
        const apiUrl = 'https://skillsbooster.onrender.com/fine-tune'; // Replace with your actual deployed URL

        // Axios request with extended timeout (30 minutes)
        const response = await axios.post(apiUrl, formData, {
            headers: formData.getHeaders(),
            timeout: 30 * 60 * 1000 // 30 minutes
        });

        // Log the full server response
        console.log('Response from the server:', JSON.stringify(response.data, null, 2));

        // If the response contains a model ID, update the folder details
        if (response.data && response.data.model_id) {
            updateFolderDetails(folderName, response.data.model_id);
        }

    } catch (error) {
        // Enhanced error logging
        if (error.response) {
            console.error(`Error Status: ${error.response.status}`);
            console.error(`Error Data: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error in setup:', error.message);
        }
        console.error('Napaka pri pridobivanju datotek ali pošiljanju zahtevka:', error.config);
    }
}

// Function to update the folder details JSON file
function updateFolderDetails(folderName, modelId) {
    let folderDetails = [];

    if (fs.existsSync(folderDetailsPath)) {
        folderDetails = JSON.parse(fs.readFileSync(folderDetailsPath, 'utf-8'));
    }

    const folderDetail = folderDetails.find(detail => detail.name === folderName);

    if (folderDetail) {
        folderDetail.model = modelId;
        folderDetail.modelCreationTime = new Date().toISOString();
    } else {
        folderDetails.push({
            name: folderName,
            url: `gs://${firebaseConfig.storageBucket}/${folderName}`,
            model: modelId,
            modelCreationTime: new Date().toISOString()
        });
    }

    fs.writeFileSync(folderDetailsPath, JSON.stringify(folderDetails, null, 2));
    console.log(`Folder details for ${folderName} updated.`);
}

// Run the function for a specific folder
processFolder('daj_bog_da_dela'); // Replace 'daj_bog_da_dela' with the desired folder name
