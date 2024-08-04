require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytesResumable, listAll, getDownloadURL } = require('firebase/storage');


const firebaseConfig = {
    apiKey: process.env.EXPRESS_APP_API_KEY,
    authDomain: process.env.EXPRESS_APP_AUTH_DOMAIN,
    projectId: process.env.EXPRESS_APP_PROJECT_ID,
    storageBucket: process.env.EXPRESS_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPRESS_APP_MESSAGING_SENDER_ID,
    appId: process.env.EXPRESS_APP_APP_ID
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


async function uploadFile(fileBuffer, targetFolder) {
    try {
        const fileName = path.basename(filePath);
        const storageRef = ref(storage, `${targetFolder}/${fileName}`);
        
        //const fileBuffer = fs.readFileSync(filePath);
        const metadata = {
            contentType: 'application/octet-stream'
        };
        
        const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);
        
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                console.error('Upload failed:', error);
            }, 
            () => {
                console.log('Upload successful!');
            }
        );
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}


async function readFiles(targetFolder, fileName) {
    try {
        const folderRef = ref(storage, targetFolder);
        const res = await listAll(folderRef);

        let downloadURL = null;
        for (let itemRef of res.items) {
            //console.log(itemRef);
            if (itemRef.name == fileName) {
                downloadURL = await getDownloadURL(itemRef);
                console.log(`File: ${itemRef.name} - URL: ${downloadURL}`);
                break;
            }
        }

        if (downloadURL === null) {
            console.log('File not found');
        }

        return downloadURL;
    } catch (error) {
        console.error('Error reading files:', error);
    }
}


//const filePath = 'C:/Users/UPORABNIK/Documents/Faks/Projekt/SkillsBooster/dokumentacija/Specifikacije_SkillsBooster.docx'; 
//const filePath = path.join('C:', 'Users', 'UPORABNIK', 'Pictures', 'oogway.jpg');
const filePath = 'C:/Users/UPORABNIK/Pictures/oogway.jpg'; 
const file = fs.readFileSync(filePath);
const targetFolder = 'daj_bog_da_dela';


uploadFile(file, targetFolder).then(() => {
    readFiles(targetFolder, 'oogway.jpg');
});
