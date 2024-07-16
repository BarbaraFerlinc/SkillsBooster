export const Users = [
    {
        id:0,
        email: 'admin@gmail.com',
        password: '12345678',
        role: 'admin',

    },
    {
        id: 1,
        email: 'boss@gmail.com',
        password: '12341',
        role: 'boss',

    },
    {
        id: 2,
        email: 'employee1@gmail.com',
        password: '123',
        role: 'user',
        domains: [
            { name: 'Domain 1', progress: 75 },
            { name: 'Domain 2', progress: 50 }
        ]
    },
    { id: 3,
        email: 'employee2@gmail.com',
        password: '1234',
        role: 'user',
        domains: ['HR']
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

export const quizzes = [
    {
        id: 1,
        name: 'Math Quiz',
        questions: [
            {
                id: 1,
                question: 'What is 2 + 2?',
                type: 'closed',
                options: ['3', '4', '5', '6'],
                correctAnswer: '4'
            },
            {
                id: 2,
                question: 'What is the capital of France?',
                type: 'closed',
                options: ['London', 'Berlin', 'Paris', 'Madrid'],
                correctAnswer: 'Paris'
            },
            {
                id: 3,
                question: 'What is the square root of 25?',
                type: 'open',
                correctAnswer: '5'
            }
        ]
    },
    {
        id: 2,
        name: 'Science Quiz',
        questions: [
            {
                id: 1,
                question: 'What is the chemical symbol for water?',
                type: 'closed',
                options: ['H2O', 'CO2', 'N2', 'O2'],
                correctAnswer: 'H2O'
            },
            {
                id: 2,
                question: 'Who developed the theory of relativity?',
                type: 'closed',
                options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Niels Bohr'],
                correctAnswer: 'Albert Einstein'
            }
        ]}
    // more quizzes...
];


