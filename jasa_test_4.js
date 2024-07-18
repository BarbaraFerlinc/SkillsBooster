require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
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

        // Define the Python script path
        const pythonScriptPath = path.join(__dirname, '..', 'AI', 'finetuning.py');

        // Spawn the Python process with the temporary JSON file path as an argument
        const pythonProcess = spawn('python', [pythonScriptPath, tempDataFilePath]);

        let modelAdapterId = '';

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            const output = data.toString();
            const match = output.match(/Model Adapter ID: (\S+)/);
            if (match) {
                modelAdapterId = match[1];
            }
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Rezultat izvajanja Python skripte: ${code}`);
            if (code === 0) {
                updateFolderDetails(folderName, modelAdapterId);
            }
        });
    } catch (error) {
        console.error('Napaka pri pridobivanju datotek:', error);
    }
}

// Function to update the folder details JSON file
function updateFolderDetails(folderName, modelAdapterId) {
    const folderDetails = JSON.parse(fs.readFileSync(folderDetailsPath, 'utf-8'));
    const folderDetail = folderDetails.find(detail => detail.name === folderName);

    if (folderDetail) {
        folderDetail.model = modelAdapterId;
        folderDetail.modelCreationTime = new Date().toISOString();
    } else {
        folderDetails.push({
            name: folderName,
            url: `gs://${firebaseConfig.storageBucket}/${folderName}`,
            model: modelAdapterId,
            modelCreationTime: new Date().toISOString()
        });
    }

    fs.writeFileSync(folderDetailsPath, JSON.stringify(folderDetails, null, 2));
    console.log(`Folder details for ${folderName} updated.`);
}

// Run the function for a specific folder
processFolder('daj_bog_da_dela'); // Replace 'daj_bog_da_dela' with the desired folder name
