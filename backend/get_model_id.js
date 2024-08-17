require('dotenv').config();
const axios = require('axios');

// Function to retrieve model ID from the API
async function retrieveModelId(resultFile) {
    try {
        const apiUrl = `https://skillsbooster.onrender.com/fine-tune-result?result_file=${encodeURIComponent(resultFile)}`;
        const response = await axios.get(apiUrl, { timeout: 10 * 60 * 1000 }); // 10 minutes timeout

        if (response.data && response.data.status === 'success' && response.data.model_id) {
            console.log('Model ID:', response.data.model_id);
            return response.data.model_id;
        } else if (response.data.status === 'error') {
            console.error('Error fetching model ID:', response.data.message);
        } else {
            console.log('Fine-tuning still in progress or no result found yet.');
        }
    } catch (error) {
        console.error('Error fetching model ID:', error.message);
    }
    return null;
}

// Example usage: replace 'example_result_file' with the actual result file name
retrieveModelId('example_result_file').then(modelId => {
    if (modelId) {
        console.log(`Model ID successfully retrieved: ${modelId}`);
    } else {
        console.log('Failed to retrieve Model ID.');
    }
});
