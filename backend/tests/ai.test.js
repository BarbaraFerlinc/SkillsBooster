require('dotenv').config(); // Uvozi dotenv in naloži .env datoteko
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

const AIHelper = require('../AIHelper'); // Uvoz AIHelper iz mape backend

(async () => {
    try {
        // Preveri, če je API ključ pravilno nastavljen
        console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

        // Testiranje getModelId
        const domain = 'text-davinci';
        const modelId = await AIHelper.getModelId(domain);
        console.log('Selected Model ID:', modelId);

        // Testiranje chatBox
        const query = 'Can you explain what machine learning is?';
        const response = await AIHelper.chatBox(modelId, query);
        console.log('AI Response:', response);
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
