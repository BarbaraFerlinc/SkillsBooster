import Domena from "./pages/Domene/Domena.jsx";

export const Users = [
    {
        id:0,
        email: 'admin@gmail.com',
        password: '12345678',
        role: 'admin',
        domains:Domena[{}]
    },
    {
        id: 1,
        email: 'boss@gmail.com',
        password: '12341',
        role: 'boss',
        domains: Domena[
            {
                id: 1,
                name: "Domena1",
                description:"to je domena 1",
                avtor: "Boss Man"

            },
                {
                    id: 2,
                    name: "Domena2",
                    description:"to je domena 2",
                    avtor: "Boss Man"

                }
            ],
    },
    {
        id: 2,
        email: 'employee1@gmail.com',
        password: '123',
        role: 'user',
        domains:Domena[{
            id:1,
        }]
    },
    { id: 3,
        email: 'employee2@gmail.com',
        password: '1234',
        role: 'user',
        domains:Domena[{
        id:2
        }]
    }
];

export const Domains=[
    {
        id:1,
        name:"Domena1",
        description:"to je domena1",
        autor_id:1

    },
    {
        id:2,
        name:"Domena2",
        description:"to je domena2",
        autor_id:1

    }
]
export const quizData = {
    name: "General Knowledge Quiz",
    questions: [
        {
            id: 1,
            question: "What is the capital of France?",
            answers: [
                { id: "A", text: "Paris", correct: true },
                { id: "B", text: "Berlin", correct: false },
                { id: "C", text: "Rome", correct: false },
                { id: "D", text: "London", correct: false }
            ]
        },
        {
            id: 2,
            question: "Which planet is known as the Red Planet?",
            answers: [
                { id: "A", text: "Venus", correct: false },
                { id: "B", text: "Mars", correct: true },
                { id: "C", text: "Jupiter", correct: false },
                { id: "D", text: "Saturn", correct: false }
            ]
        },
        {
            id: 3,
            question: "What is the chemical symbol for water?",
            answers: [
                { id: "A", text: "H2O", correct: true },
                { id: "B", text: "CO2", correct: false },
                { id: "C", text: "N2", correct: false },
                { id: "D", text: "O2", correct: false }
            ]
        }
    ]
};
