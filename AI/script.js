// Primer funkcije za komunikacijo z OpenAI ChatGPT
async function askChatGPT(prompt) {
    const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'sk-proj-Ff9qrOZrMLIksYFWARJ6T3BlbkFJ3SrMQAZr7n7RYINpuobn' // Opozorilo: To nikoli ne smete tako uporabljati v produkciji!
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 150
        })
    });
    const data = await response.json();
    return data.choices[0].text;
}

// Primer funkcije za nalaganje datotek in shranjevanje v IndexedDB ali v spomin
function uploadFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            // Tu lahko shranite vsebino v IndexedDB ali jo začasno hranite v spominu
            console.log(content); // Prikaz vsebine datoteke v konzoli
            // Dodajte klic na funkcijo, ki bo uporabila vsebino v naslednjem zahtevku za ChatGPT
        };
        reader.readAsText(file);
    }
}

// Dodajte HTML elemente za izbiro datotek in pošiljanje vprašanj
document.body.innerHTML = `
    <input type="file" id="file-input" onchange="uploadFile(event)">
    <input type="text" id="question-input" placeholder="Type your question">
    <button onclick="sendQuestion()">Ask GPT</button>
    <div id="response"></div>
`;

async function sendQuestion() {
    const question = document.getElementById('question-input').value;
    const response = await askChatGPT(question);
    document.getElementById('response').innerText = response;
}
