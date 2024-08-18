const db = require('../db');
const { storage, ref, uploadBytes, deleteObject, uploadBytesResumable, listAll, getDownloadURL } = require('../firebase');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const FormData = require('form-data');

dotenv.config();

class Domain {
    static async add(name, description, key_skills, owner) {
        try {
            const id = name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            const empty = Buffer.alloc(0);
            const folder = ref(storage, `${id}/.placeholder`);
            uploadBytes(folder, empty).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            }).catch((error) => {
                console.error('Error uploading file:', error);
            });

            const newDomain = {
                name: name,
                description: description,
                key_skills: key_skills,
                owner: owner,
                quizzes: [],
                employees: [],
                results: [],
                learning_materials: [],
                links: []
            };

            db.collection("Knowledge_domains").doc(id).set(newDomain);
            return { message: 'Domain added successfully', domain: newDomain };
        } catch (error) {
            throw new Error('Error inserting the domain into the database: ' + error.message);
        }
    }

    static async all() {
        try {
            const domainsRef = db.collection("Knowledge_domains");
            const response = await domainsRef.get();
            const domains = [];
            response.forEach(doc => {
                domains.push(doc.data());
            });

            return domains;
        } catch (error) {
            throw new Error('Error retrieving domains from the database: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            return domain;
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async getByUser(id) {
        try {
            const domainsRef = db.collection("Knowledge_domains");
            const response = await domainsRef.where('employees', 'array-contains', `${id}`).get();
            const domains = [];
            response.forEach(doc => {
                domains.push(doc.data());
            });

            return domains;
        } catch (error) {
            throw new Error('Error retrieving domains from the database: ' + error.message);
        }
    }

    static async getByOwner(id) {
        try {
            const domainsRef = db.collection("Knowledge_domains");
            const response = await domainsRef.where('owner', '==', `${id}`).get();
            const domains = [];
            response.forEach(doc => {
                domains.push(doc.data());
            });

            return domains;
        } catch (error) {
            throw new Error('Error retrieving domains from the database: ' + error.message);
        }
    }

    static async change(id, name, description, key_skills) {
        try {
            if (this.getById(id) != undefined) {
                const domain = {
                    name: name,
                    description: description,
                    key_skills: key_skills
                };

                db.collection("Knowledge_domains").doc(id).update(domain);
                return { message: 'Domain update successful', domain: domain };
            } else {
                return { message: 'Domain update failed', domain: undefined };
            }
        } catch (error) {
            throw new Error('Error updating domain in database: ' + error.message);
        }
    }

    static async addUser(id, userId) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.employees && domain.employees.includes(userId)) {
                return { message: 'The user is already included in this domain', domain: domain };
            }
            const updatedEmployees = domain.employees ? [...domain.employees, userId] : [userId];

            if (domain.results && domain.results.includes(`${userId};0`)) {
                return { message: 'The user is already included in this domain', domain: domain };
            }
            const updatedResults = domain.results ? [...domain.results, `${userId};0`] : [`${userId};0`];

            db.collection("Knowledge_domains").doc(id).update({employees: updatedEmployees, results: updatedResults});
            return { message: 'Domain update successful', domain: domain };
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async findUsers(id) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();
            const users = domain.employees;

            return users;
        } catch (error) {
            throw new Error('Error retrieving users from database: ' + error.message);
        }
    }

    static async deleteUser(id, userId) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.employees && domain.employees.includes(userId)) {
                const updatedEmployees = domain.employees.filter(employeeId => employeeId !== userId);

                await db.collection("Knowledge_domains").doc(id).update({ employees: updatedEmployees });
                return { message: 'User successfully removed from domain', domain: domain };
            } else {
                return { message: 'The user is not part of this domain', domain: domain };
            }
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async addQuiz(id, quizId) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.quizzes && domain.quizzes.includes(quizId)) {
                return { message: 'Quiz is already included in this domain', domain: domain };
            }
            const updatedQuizzes = domain.quizzes ? [...domain.quizzes, quizId] : [quizId];

            db.collection("Knowledge_domains").doc(id).update({quizzes: updatedQuizzes});
            return { message: 'Domain update successful', domain: domain };
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async findQuizzes(id) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();
            const quizzes = domain.quizzes;

            return quizzes;
        } catch (error) {
            throw new Error('Error retrieving quizzes from database: ' + error.message);
        }
    }

    static async deleteQuiz(id, quizId) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.quizzes && domain.quizzes.includes(quizId)) {
                const updatedQuizzes = domain.quizzes.filter(existingQuizId => existingQuizId !== quizId);

                await db.collection("Knowledge_domains").doc(id).update({ quizzes: updatedQuizzes });
                return { message: 'Quiz successfully removed from domain', domain: domain };
            } else {
                return { message: 'Quiz is not part of this domain', domain: domain };
            }
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async addResult(id, userId, value) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            const result = `${userId};${value}`;

            let updatedResults = [];

            if (domain.results) {
                const index = domain.results.findIndex(r => {
                    const [user] = r.split(';');
                    return user === `${userId}`;
                });

                if (index !== -1) {
                    domain.results[index] = result;
                    updatedResults = [...domain.results];
                } else {
                    updatedResults = [...domain.results, result];
                }
            } else {
                updatedResults = [result];
            }

            db.collection("Knowledge_domains").doc(id).update({results: updatedResults});
            return { message: 'Domain update successful', domain: domain };
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async findResult(id, userId) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.results && domain.results.some(r => {
                const [user] = r.split(';');
                return user === `${userId}`;
            })) {
                const result = domain.results.find(r => {
                    const [user] = r.split(';');
                    return user === `${userId}`;
                });
                const resultValue = result.split(';')[1];

                return resultValue;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async changeResult(id, userId, newValue) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (!domain.results) {
                return { message: 'No results are available for this domain', domain: domain };
            }

            const index = domain.results.findIndex(r => {
                const [user] = r.split(';');
                return user === `${userId}`;
            });

            if (index !== -1) {
                domain.results[index] = `${userId};${newValue}`;
                await db.collection("Knowledge_domains").doc(id).update({ results: domain.results });
                return { message: 'Result successfully updated', domain: domain };
            } else {
                return { message: 'There is no result for this user', domain: domain };
            }
        } catch (error) {
            throw new Error('Error updating result: ' + error.message);
        }
    }

    static async deleteResult(id, userId) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.results && domain.results.some(r => {
                const [user] = r.split(';');
                return user === `${userId}`;
            })) {
                const updatedResults = domain.results.filter(r => {
                    const [user] = r.split(';');
                    return user !== `${userId}`;
                });

                await db.collection("Knowledge_domains").doc(id).update({ results: updatedResults });
                return { message: 'Result successfully removed from domain', domain: domain };
            } else {
                return { message: 'The result is not part of this domain', domain: domain };
            }
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }


    
static async getModelId(domain) {
    try {
        const responseModel = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });
        const models = responseModel.data.data;

        // Filter models based on the domain
        const filteredModels = domain
            ? models.filter(model => model.id.includes(domain))
            : models;

        // Further filter out models containing 'ckpt-step'
        const filteredWithoutStep = filteredModels.filter(model => !model.id.includes('ckpt-step'));

        if (filteredWithoutStep.length === 0) {
            console.warn(`No models found for the domain "${domain}". Falling back to default model.`);
            return 'gpt-4-turbo';
        }

        // Find the most recent model
        const lastModel = filteredWithoutStep.reduce((latest, model) => {
            return new Date(model.created * 1000) > new Date(latest.created * 1000) ? model : latest;
        }, filteredWithoutStep[0]);

        // Save filtered model IDs to a file (for debugging or auditing)
        const outputFilePath = './filtered_model_ids.json';
        fs.writeFileSync(outputFilePath, JSON.stringify(filteredWithoutStep.map(model => model.id), null, 2));

        // Return the ID of the last (most recent) model or default model if not found
        return lastModel ? lastModel.id : 'gpt-4-turbo';

    } catch (error) {
        console.error("Error fetching model IDs from OpenAI API: ", error.response ? error.response.data : error.message);
        return 'gpt-4-turbo'; // Fallback to a default model ID
    }
}

static async chatBox(modelId, query) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: modelId,
                messages: [
                    { role: 'system', content: 'You are a teacher whose primary purpose is to explain every concept in meticulous detail, ensuring clarity and understanding for the student. Your explanations should be thorough, step-by-step, and consider that the student may have no prior knowledge of the subject. Please use clear language, provide examples, and make complex ideas as simple as possible. You cannot generate code.' },
                    { role: 'user', content: query },
                ],
                max_tokens: 150,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            const errorMsg = error.response.data.error.message;
            console.error("Error communicating with OpenAI API: ", errorMsg);

            if (errorMsg.includes('model')) {
                // If the error is related to the model, log it and fallback to a default model
                console.warn('Falling back to default model: gpt-4-turbo');
                return await this.chatBox('gpt-4-turbo', query);
            }
        }
        return 'Sorry, something went wrong while trying to generate a response.';
    }
}

static async updateModel(folderName, imePodrocja) {
    try {
        console.log(`Starting update model process for folder: ${folderName}, domain: ${imePodrocja}`);

        // Fetch file URLs using the existing fetchFileUrls method
        const datoteke = await this.fetchFileUrls(folderName);
        console.log('Fetched files:', datoteke);

        // Check if datoteke array is valid
        if (!Array.isArray(datoteke) || datoteke.length === 0) {
            throw new Error('No files retrieved or datoteke is not an array.');
        }

        // Convert the file data to a JSON string
        const jsonData = JSON.stringify(datoteke, null, 2);

        // Create a form data object and append the JSON data as a blob (in-memory)
        const formData = new FormData();
        formData.append('files_data', jsonData, {
            filename: 'temp_data.json',
            contentType: 'application/json'
        });
        formData.append('ime_podrocja', imePodrocja);

        console.log('Sending POST request to API...');
        // Send a POST request to the FastAPI endpoint
        const apiUrl = 'https://skillsbooster.onrender.com/fine-tune'; // Replace with your actual deployed URL

        // Axios request with extended timeout (5 minutes)
        const response = await axios.post(apiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Type': 'multipart/form-data'
            },
            timeout: 5 * 60 * 1000 // 5 minutes
        });

        // Log the full server response
        console.log('Response from the server:', JSON.stringify(response.data, null, 2));

        // If the response contains a model ID, update the folder details
        if (response.data && response.data.model_id) {
            await this.updateFolderDetails(folderName, response.data.model_id);
        }

    } catch (error) {
        // Enhanced error logging
        console.error('An error occurred during the update model process:', error.message);
        if (error.response) {
            console.error(`Error Status: ${error.response.status}`);
            console.error(`Error Data: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error in setup:', error.message);
        }
        console.error('Error during file retrieval or request submission:', error.config);
    }
}


static async fetchFileUrls(folderName) {
    try {
        const folderRef = ref(storage, folderName);
        const list = await listAll(folderRef);

        if (list.items.length === 0) {
            console.log('No files found in the folder.');
            return [];
        }

        const fileUrls = await Promise.all(list.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            // Use optional chaining to safely access the name property
            const name = itemRef?.name || 'Unnamed File';
            return { ime: name, url: url };
        }));

        return fileUrls;
    } catch (error) {
        console.error('Error fetching file URLs:', error.message);
        throw error;
    }
}

static async updateFolderDetails(folderName, modelId) {
    try {
        const folderDetailsPath = path.join(__dirname, 'folder_details.json'); // Ensure this is defined
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
                url: `gs://${firebaseConfig.storageBucket}/${folderName}`, // Ensure firebaseConfig is defined
                model: modelId,
                modelCreationTime: new Date().toISOString()
            });
        }

        fs.writeFileSync(folderDetailsPath, JSON.stringify(folderDetails, null, 2));
        console.log(`Folder details for ${folderName} updated.`);
    } catch (error) {
        console.error('Error updating folder details:', error.message);
        throw error;
    }
}

    static async addLink(id, link) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.links && domain.links.includes(link)) {
                return { message: 'The link is already included in this domain', domain: domain };
            }
            const updatedLinks = domain.links ? [...domain.links, link] : [link];

            db.collection("Knowledge_domains").doc(id).update({links: updatedLinks});
            return { message: 'Domain update successful', domain: domain };
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async findLinks(id) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();
            const links = domain.links;

            return links;
        } catch (error) {
            throw new Error('Error retrieving links from database: ' + error.message);
        }
    }

    static async deleteLink(id, link) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.links && domain.links.includes(link)) {
                const updatedLinks = domain.links.filter(existingLink => existingLink !== link);

                await db.collection("Knowledge_domains").doc(id).update({ links: updatedLinks });
                return { message: 'Link successfully removed from domain', domain: domain };
            } else {
                return { message: 'The link is not part of this domain', domain: domain };
            }
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async addLearningMaterial(id, name, fileBuffer) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain.learning_materials && domain.learning_materials.includes(name)) {
                return { message: 'The learning material is already part of this domain', domain: domain };
            }
        
            const updatedLearningMaterials = [...(domain.learning_materials || []), name];
            await domainRef.update({ learning_materials: updatedLearningMaterials });
            
            const storageRef = ref(storage, `${id}/${name}`);
            
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
                    throw new Error('Upload failed: ' + error.message);
                }, 
                () => {
                    return { message: 'Upload successful!', learning_material: name };
                }
            );
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    static async findLearningMaterials(id) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();
            const learning_materials = domain.learning_materials;

            return learning_materials;
        } catch (error) {
            throw new Error('Error retrieving learning materials from database: ' + error.message);
        }
    }

    static async readLearningMaterial(id, name) {
        try {
            const folderRef = ref(storage, id);
            const res = await listAll(folderRef);
    
            let downloadURL = null;
            for (let itemRef of res.items) {
                if (itemRef.name == name) {
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
            throw new Error('Error reading files: ' + error.message);
        }
    }

    static async deleteLearningMaterial(id, name) {
        const domainRef = db.collection("Knowledge_domains").doc(id);
        const response = await domainRef.get();
        const domain = response.data();

        if (!domain.learning_materials || !domain.learning_materials.includes(name)) {
            return { message: 'The learning material is not part of this domain', domain: domain };
        }

        const updatedLearningMaterials = domain.learning_materials.filter(item => item !== name);
        await domainRef.update({ learning_materials: updatedLearningMaterials });

        try {
            const learningMaterialRef = ref(storage, `${id}/${name}`);
            deleteObject(learningMaterialRef).then(() => {
                console.log('File deleted');
            }).catch((error) => {
                console.log('Error with file deletion');
            });
            return { message: 'Learning material deleted successfully', learningMaterial: name };
        } catch (error) {
            throw new Error('Error retrieving domain from database: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const domainRef = db.collection("Knowledge_domains").doc(id);
            const response = await domainRef.get();
            const domain = response.data();

            if (domain == undefined) {
                throw new Error('The domain does not exist');
            }
            await db.collection("Knowledge_domains").doc(id).delete();

            return { message: 'Domain deleted', domain: domain };
        } catch (error) {
            throw new Error('Error deleting domain from database: ' + error.message);
        }
    }
}

module.exports = Domain;