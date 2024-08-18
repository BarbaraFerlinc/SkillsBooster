require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const apiKey = process.env.OPENAI_API_KEY;

// Funkcija za pridobivanje vseh modelov
async function fetchModels(suffix = '') {
    try {
        const response = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const models = response.data.data;

        // Filtriraj modele po sufiksu, če je določen
        const filteredModels = suffix
            ? models.filter(model => model.id.includes(suffix))
            : models;

        // Izključi modele, ki vsebujejo "ckpt-step" v ID-ju
        const filteredWithoutStep = filteredModels.filter(model => !model.id.includes('ckpt-step'));

        // Pridobi zadnji model glede na čas ustvarjanja
        const lastModel = filteredWithoutStep.reduce((latest, model) => {
            return new Date(model.created * 1000) > new Date(latest.created * 1000) ? model : latest;
        }, filteredWithoutStep[0]);

        console.log('Filtered Models:', filteredWithoutStep.map(model => model.id));
        console.log('Last Model:', lastModel.id);

        // Shranjevanje ID-jev v JSON datoteko
        const outputFilePath = './filtered_model_ids.json';
        fs.writeFileSync(outputFilePath, JSON.stringify(filteredWithoutStep.map(model => model.id), null, 2));
        console.log(`Filtered Model IDs saved to ${outputFilePath}`);

        return lastModel.id;
    } catch (error) {
        console.error('Error fetching models:', error.response ? error.response.data : error.message);
    }
}

const suffix = 'personal'; // Zamenjaj z iskalnim nizom ali pusti prazno za vse modele
fetchModels(suffix);
