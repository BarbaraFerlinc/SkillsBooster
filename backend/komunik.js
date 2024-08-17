require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.OPENAI_API_KEY;
const modelId = 'ft:gpt-4o-mini-2024-07-18:personal::9wcAcylo';  // Model ID, ki ga želiš uporabiti

// Funkcija za pošiljanje zahtevka modelu
async function sendRequestToModel(messageContent) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: modelId,
                messages: [
                    { role: 'system', content: 'You are a teacher whose primary purpose is to explain every concept in meticulous detail, ensuring clarity and understanding for the student. Your explanations should be thorough, step-by-step, and consider that the student may have no prior knowledge of the subject. Please use clear language, provide examples, and make complex ideas as simple as possible.' },  // Sistem lahko dodaš specifične informacije, ki usmerjajo model.
                    { role: 'user', content: messageContent },  // Sporočilo, ki ga pošiljaš kot uporabnik.
                ],
                max_tokens: 150,  // Število tokenov, ki jih želiš v odgovoru
                temperature: 0.7,  // Nadzoruje ustvarjalnost odgovora
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        // Prikaz odgovora modela
        console.log('Model response:', response.data.choices[0].message.content.trim());
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.response ? error.response.data : error.message);
    }
}

// Uporaba funkcije
const messageContent = "Povej mi nekaj zanimivega o umetni inteligenci.";
sendRequestToModel(messageContent);
