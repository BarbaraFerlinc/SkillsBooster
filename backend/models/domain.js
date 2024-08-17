const db = require('../db');
const { storage, ref, uploadBytes, deleteObject, uploadBytesResumable, listAll, getDownloadURL } = require('../firebase');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

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

    static async getModelId(domain) {
        try {
            const responseModel = await axios.get('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            });
            const models = responseModel.data.data;
    
            const filteredModels = domain
                ? models.filter(model => model.id.includes(domain))
                : models;
            const filteredWithoutStep = filteredModels.filter(model => !model.id.includes('ckpt-step'));
    
            const lastModel = filteredWithoutStep.reduce((latest, model) => {
                return new Date(model.created * 1000) > new Date(latest.created * 1000) ? model : latest;
            }, filteredWithoutStep[0]);
    
            const outputFilePath = './filtered_model_ids.json';
            fs.writeFileSync(outputFilePath, JSON.stringify(filteredWithoutStep.map(model => model.id), null, 2));
    
            let modelId = '';
            if (!lastModel) {
                modelId = 'gpt-4-turbo';
            } else {
                modelId = lastModel.id;
            }
            return modelId;
        } catch (error) {
            console.error(error.response);
        }
    }

    static async chatBox(modelId, query) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: modelId,
                    messages: [
                        { role: 'system', content: 'You are a teacher whose primary purpose is to explain every concept in meticulous detail, ensuring clarity and understanding for the student. Your explanations should be thorough, step-by-step, and consider that the student may have no prior knowledge of the subject. Please use clear language, provide examples, and make complex ideas as simple as possible.' },
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
            console.log(response);
            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error("Error communicating with OpenAI API: ", error.response ? error.response.data : error.message);
        }
    }

    static async updateModel(id) {
        try {
            const tempDataFilePath = path.join(__dirname, 'temp_data.json');
            const folderDetailsPath = path.join(__dirname, 'folder_details.json');

            const folderRef = ref(storage, id);
            const list = await listAll(folderRef);
            const files = await Promise.all(list.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return { name: itemRef.name, url: url };
            }));
            console.log('Retrieved files: ', files);

            fs.writeFileSync(tempDataFilePath, JSON.stringify(files, null, 2));
            console.log('temp_data.json has been updated.');

            const formData = new FormData();
            formData.append('temp_file', fs.createReadStream(tempDataFilePath));

            const apiUrl = process.env.OPENAI_FINETUNE_URL;
            const response = await axios.post(apiUrl, formData, {
                headers: formData.getHeaders(),
                timeout: 30 * 60 * 1000 // 30 minutes
            });
    
            console.log('Response from the server:', JSON.stringify(response.data, null, 2));
    
            if (response.data && response.data.model_id) {
                const modelId = response.data.model_id;
                let folderDetails = [];

                if (fs.existsSync(folderDetailsPath)) {
                    folderDetails = JSON.parse(fs.readFileSync(folderDetailsPath, 'utf-8'));
                }

                const folderDetail = folderDetails.find(detail => detail.name === id);

                if (folderDetail) {
                    folderDetail.model = modelId;
                    folderDetail.modelCreationTime = new Date().toISOString();
                } else {
                    folderDetails.push({
                        name: id,
                        url: `gs://${process.env.EXPRESS_APP_STORAGE_BUCKET}/${id}`,
                        model: modelId,
                        modelCreationTime: new Date().toISOString()
                    });
                }

                fs.writeFileSync(folderDetailsPath, JSON.stringify(folderDetails, null, 2));
                console.log(`Folder details for ${id} updated.`);
            }
            return { message: 'Model update successful.' };
        } catch (error) {
            if (error.response) {
                console.error('Error status: ' + error.response.status);
                console.error('Error data: ' + JSON.stringify(error.response.data, null, 2));
            } else if (error.request) {
                console.error('No response received: ' + error.request);
            } else {
                console.error('Error in setup:: ' + error.message);
            }
            console.error('Error retrieving files or sending request:', error.config);
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