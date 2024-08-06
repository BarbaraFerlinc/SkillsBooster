const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function getModelResponse(req, res) {
    const { domain, query } = req.params;
    console.log(`Received request: domain=${domain}, query=${query}`); // Log incoming request

    // Read folder_details.json
    const folderDetailsPath = path.join(__dirname, '../folder_details.json');
    const folderDetails = JSON.parse(fs.readFileSync(folderDetailsPath, 'utf8'));

    // Find the model for the given domain
    const domainDetails = folderDetails.find(item => item.name === domain);
    if (!domainDetails || !domainDetails.model) {
        return res.status(400).json({ error: 'Model not found for the specified domain' });
    }

    const url = `https://api.gradient.ai/api/models/${domainDetails.model}/complete`;
    const payload = {
        autoTemplate: true,
        query: decodeURIComponent(query),
        maxGeneratedTokenCount: 200
    };
    const headers = {
        accept: "application/json",
        "x-gradient-workspace-id": "86abdbb7-ca5f-4f71-9882-01970e111de7_workspace",
        "content-type": "application/json",
        authorization: "Bearer zHkm0nTvAVXsUobrgw4UelOfRQsKRCl2"
    };

    try {
        console.log('Sending request to AI model...');
        const response = await axios.post(url, payload, { headers });
        console.log('Backend response:', response.data); // Log backend response

        res.status(200).json({ text: response.data.generatedOutput || response.data.choices[0].text });
    } catch (error) {
        console.error('Error in backend:', error); // Log the exact error
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getModelResponse,
};
