require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const apiKey = process.env.OPENAI_API_KEY;

// Funkcija za pridobivanje vseh modelov
async function fetchModels() {
    try {
        const response = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        // Preveri strukturo podatkov, ki jih vrne API
        console.log('API Response Data:', response.data);

        // Izpis vseh ID-jev modelov
        const modelIds = response.data.data.map(model => model.id);  // Preveri strukturo in pridobi ID-je
        console.log('Model IDs:', modelIds);

        // Shranjevanje ID-jev v JSON datoteko
        const outputFilePath = './model_ids.json';
        fs.writeFileSync(outputFilePath, JSON.stringify(modelIds, null, 2));
        console.log(`Model IDs saved to ${outputFilePath}`);

        return modelIds;
    } catch (error) {
        console.error('Error fetching models:', error.response ? error.response.data : error.message);
    }
}

// Klic funkcije za pridobivanje modelov
fetchModels();
