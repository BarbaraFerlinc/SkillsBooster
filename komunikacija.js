// dostop do modela

const axios = require('axios');

const url = "https://api.gradient.ai/api/models/c5cc3ea5-f2a1-4212-b8a5-fc8a0d668009_model_adapter/complete";

const payload = {
    autoTemplate: true,
    query: "What is the capital of France?",
    maxGeneratedTokenCount: 200
};

//c5cc3ea5-f2a1-4212-b8a5-fc8a0d668009_model_adapter

//399e5ea8-21ba-4558-89b3-d962f7efd0db_model_adapter
const headers = {
    accept: "application/json",
    "x-gradient-workspace-id": "86abdbb7-ca5f-4f71-9882-01970e111de7_workspace",
    "content-type": "application/json",
    authorization: "Bearer zHkm0nTvAVXsUobrgw4UelOfRQsKRCl2"
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
