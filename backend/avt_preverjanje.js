// dostop do modela

const axios = require('axios');

const url = process.env.GRADIENT_MODEL_URL;

const payload = {
    autoTemplate: true,
    query: "What is the capital of France?",
    maxGeneratedTokenCount: 200
};

const headers = {
    accept: "application/json",
    "x-gradient-workspace-id": process.env.GRADIENT_WORKSPACE_ID,
    "content-type": "application/json",
    authorization: `Bearer ${process.env.GRADIENT_ACCESS_TOKEN}`
};

axios.post(url, payload, { headers })
    .then(response => {
        console.log("Status Code:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Body:", response.data);
    })
    .catch(error => {
        console.error("Error:", error.response ? error.response.data : error.message);
    });
