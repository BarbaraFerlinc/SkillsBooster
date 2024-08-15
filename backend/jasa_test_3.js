require('dotenv').config();
const fetch = require('node-fetch'); // Ensure you have node-fetch installed: npm install node-fetch

class Kviz {
    static async preveriOdgovor(id, query, answer) {
        try {
            // Simulated quiz data (instead of fetching from a database)
            const quizzes = {
                'testKviz1': {
                    vprasanja: [
                        { id: 'q1', vprasanje: 'What is 2 + 2?', pravilenOdgovor: '4' },
                        { id: 'q2', vprasanje: 'Capital of France?', pravilenOdgovor: 'Paris' },
                    ]
                },
                'testKviz2': {
                    vprasanja: [
                        { id: 'q1', vprasanje: 'Who wrote "1984"?', pravilenOdgovor: 'George Orwell' },
                        { id: 'q2', vprasanje: 'Square root of 16?', pravilenOdgovor: '4' },
                    ]
                }
            };

            const kviz = quizzes[id];

            if (!kviz) {
                throw new Error('Kviz ne obstaja');
            }

            const vprasanje = kviz.vprasanja.find(vprasanje => vprasanje.id === query || vprasanje.vprasanje === query);

            if (!vprasanje) {
                throw new Error('Vprašanje ne obstaja v tem kvizu');
            }

            const rightAnswer = vprasanje.pravilenOdgovor || '';

            const prompt = `Given the expected response: '${rightAnswer}', and the generated response: '${answer}' to the question '${vprasanje.vprasanje}', does the generated response accurately capture the key information? Yes or No.`;

            const responseGPT = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 150,
                    temperature: 0,
                    top_p: 1,
                    n: 1,
                    stop: ["\n"]
                })
            });

            const data = await responseGPT.json();

            // Log the entire response for debugging
            console.log('OpenAI API response:', JSON.stringify(data, null, 2));

            if (!data.choices || data.choices.length === 0) {
                throw new Error('No choices returned by the API');
            }

            const evaluationResult = data.choices[0].message.content.trim();

            return evaluationResult.toLowerCase().includes('yes');
        } catch (error) {
            throw new Error('Error evaluating response: ' + error.message);
        }
    }
}

const runTests = async () => {
    const testCases = [
        { id: 'testKviz1', query: 'q1', answer: '4', expected: true },
        { id: 'testKviz1', query: 'q2', answer: 'paris', expected: true },
        { id: 'testKviz2', query: 'q1', answer: 'george orwell', expected: true },
        { id: 'testKviz2', query: 'q2', answer: 'five', expected: false },
        { id: 'testKviz2', query: 'q2', answer: '4', expected: true },
    ];

    for (let i = 0; i < testCases.length; i++) {
        const { id, query, answer, expected } = testCases[i];
        try {
            const result = await Kviz.preveriOdgovor(id, query, answer);
            console.log(`Test ${i + 1} - Expected: ${expected}, Got: ${result}, ${result === expected ? 'PASS' : 'FAIL'}`);
        } catch (error) {
            console.log(`Test ${i + 1} - Error: ${error.message}`);
        }
    }
};

runTests();
