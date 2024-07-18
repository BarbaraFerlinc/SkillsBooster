/// EVALUACIJA PRAVILNOSTI TRUE/FALSE



const axios = require('axios');

/**
 * Evaluate the response generated by the model.
 *
 * @param {Object} modelAdapter - The model adapter instance used to generate the response.
 * @param {string} prompt - The evaluation prompt containing the actual and predicted responses.
 * @returns {Promise<boolean>} - Promise resolving to a boolean indicating whether the generated response is successful.
 */
async function evaluateResponseWithModel(modelAdapter, prompt) {
    try {
        const response = await axios.post('https://api.gradient.ai/api/models/399e5ea8-21ba-4558-89b3-d962f7efd0db_model_adapter/complete', {
            query: prompt,
            maxGeneratedTokenCount: 100
        }, {
            headers: {
                'accept': 'application/json',
                'x-gradient-workspace-id': '86abdbb7-ca5f-4f71-9882-01970e111de7_workspace',
                'content-type': 'application/json',
                'authorization': 'Bearer zHkm0nTvAVXsUobrgw4UelOfRQsKRCl2'
            }
        });
        
        const evaluationResult = response.data.generatedOutput;
        return evaluationResult.includes('Yes');
    } catch (error) {
        console.error(`Error evaluating response: ${error}`);
        return false;
    }
}


(async () => {
    const modelAdapter = {}; // This can be an empty object since the function doesn't use it directly

    const prompt1 = "Given the expected response: 'The sky is cloudy.', and the generated response: 'The sky is sunny.', does the generated response accurately capture the key information? Yes or No.";
    const prompt2 = "Given the expected response: 'Water is wet.', and the generated response: 'Water is wet.', does the generated response accurately capture the key information? Yes or No.";
    const prompt3 = "Given the expected response: 'Fire is hot.', and the generated response: 'Fire is cold.', does the generated response accurately capture the key information? Yes or No.";

    const result1 = await evaluateResponseWithModel(modelAdapter, prompt1);
    console.log(`Evaluation 1 successful: ${result1}`);  // Expected: false

    const result2 = await evaluateResponseWithModel(modelAdapter, prompt2);
    console.log(`Evaluation 2 successful: ${result2}`);  // Expected: true

    const result3 = await evaluateResponseWithModel(modelAdapter, prompt3);
    console.log(`Evaluation 3 successful: ${result3}`);  // Expected: false
})();

/*
*
// Example usage
(async () => {
    const modelAdapter = {}; // This can be an empty object since the function doesn't use it directly
    const prompt = "Given the expected response: 'expected_response', and the generated response: 'generated_response', does the generated response accurately capture the key information? Yes or No.";
    const result = await evaluateResponseWithModel(modelAdapter, prompt);
    console.log(`Evaluation successful: ${result}`);
})();
*/