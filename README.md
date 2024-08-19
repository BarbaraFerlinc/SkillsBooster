# SkillsBooster
## Description
Our platform offers a comprehensive tool designed to support companies in 
evaluating and developing their employees' knowledge through customizable
self-assessment questionnaires and AI-generated learning content.

The solution aids management in ensuring the continuous growth of their team's skills.
## Key functionalities
### * Knowledge Domain Management:
+ Easily add and manage knowledge domains
+ Define and edit key competencies within each domain
### * Question Management
* User-friendly interface for creating, editing and deleting questions within a domain
* Option to include correct and incorrect answers for each question
* Link questions to theoretical knowledge or relevant learning resources
### * AI Integration
* AI-powered generation of simple answers
* Analysis of user responses to identify knowledge gaps
### * Learning Material
* Link or upload learning materials such as articles, videos, e-books, or web resources relevant to knowledge enhancement.
* Organize learning materials by domain and specific competencies.
### * Skills Matrix Generation 
+ Track employee progress and compare knowledge levels
+ Automatically generate and update a Skills Matrix based on employee progress
### Responsiveness and Accessibility 
+ Intuitive and user-friendly interface for easy navigation and use
+ Accessible on various devices (computers, tablets and smartphones) with adaptability to different screen sizes.

### Technologies used
<div style="width: 100%; text-align: center;">

|                                                                                     React JSX                                                                                     |                                                                               JavaScript                                                                                |                                                                                Python                                                                                |                                                                                   Firebase                                                                                    |                                                                                     NoSQL                                                                                     |                                                                                     OpenAI                                                                                     |
|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | 
| <a href="https://reactjs.org/docs/introducing-jsx.html" title="React JSX"><img src="https://github.com/get-icon/geticon/raw/master/icons/react.svg" alt="React JSX" width="50px" height="50px"></a> | <a href="https://www.javascript.com/" title="JavaScript"><img src="https://github.com/get-icon/geticon/raw/master/icons/javascript.svg" alt="JavaScript" width="50px" height="50px"></a> | <a href="https://www.python.org/" title="Python"><img src="https://github.com/get-icon/geticon/raw/master/icons/python.svg" alt="Python" width="50px" height="50px"></a> | <a href="https://firebase.google.com/" title="Firebase"><img src="https://github.com/get-icon/geticon/raw/master/icons/firebase.svg" alt="Firebase" width="50px" height="50px"></a> | <a href="https://en.wikipedia.org/wiki/NoSQL" title="NoSQL"><img src="https://github.com/get-icon/geticon/raw/master/icons/mongodb-icon.svg" alt="NoSQL" width="50px" height="50px"></a> | <a href="https://openai.com/" title="OpenAI"><img src="https://assets-global.website-files.com/5e6aa3e3f001fae105b8e1e7/63920ffe0f48f96db746221d_open-ai-logo-8B9BFEDC26-seeklogo.com.png" alt="OpenAI" width="50px" height="50px"></a> |

</div>

## AI
### Installation & development
In `backend/ai` directory first install all necessary requirements with code:
```bash
pip install requirements.txt
```
To directory also upload an `.env` file and change values according to your Openai project:
```bash
# AI configuration
OPENAI_API_KEY= <openai-api-key>
```
Run the following command
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --timeout-keep-alive 3000
```
to start ai server on `port 8000`.

## Backend
### Installation & development
In `backend` directory first install all necessary node_modules with code:
```bash
npm install
```
To directory also upload `key.json` file from your Firebase project and an `.env` file and change values according to your Firebase/Openai project and your email:
```bash
# Access CORS
ACCESS_CORS= <frontend-url>
# Firebase configuration
EXPRESS_APP_API_KEY= <firebase-api-key>
EXPRESS_APP_AUTH_DOMAIN= <firebase-auth-domain>
EXPRESS_APP_PROJECT_ID= <firebase-project-id>
EXPRESS_APP_STORAGE_BUCKET= <firebase-storage-bucket>
EXPRESS_APP_MESSAGING_SENDER_ID= <firebase-messaging-sender-id>
EXPRESS_APP_APP_ID= <firebase-app-id>
# AI configuration
OPENAI_FINETUNE_URL= <openai-finetunig-url>
OPENAI_API_KEY= <openai-api-key>
OPENAI_BACKUP_MODEL= <openai-basic-model>
# SMTP configuration
SMTP_HOST= <smtp-host>
SMTP_PORT= <smtp-port>
SMTP_USER= <smtp-email>
SMTP_PASSWORD= <smtp-password>
```
Run
```bash
node server.js
```
to start the server on `port 9000`.
### Testing
Run unit tests with:
```bash
npm test
```

## Frontend
### Installation & development
In `frontend` directory install all necessary node_modules with code:
```bash
npm install
```
To directory also upload an `.env` file and change values according to your Firebase project:
```bash
# Link to backend
VITE_APP_BASE_URL= <backend-url>
# Firebase configuration
VITE_API_KEY= <firebase-api-key>
VITE_AUTH_DOMAIN= <firebase-auth-domain>
VITE_PROJECT_ID= <firebase-project-id>
VITE_STORAGE_BUCKET= <firebase-storage-bucket>
VITE_MESSAGING_SENDER_ID= <firebase-messaging-sender-id>
VITE_APP_ID= <firebase-app-id>
```
Run the following command
```bash
npm run dev
```
to start the development server on `port 5173`.
### Build
To create a production build of the application, run:
```bash
npm run build
```

## Documentation
If you want more detailed look at our work process or more information on how the app works, visit [SkillsBooster Documentation](https://github.com/BarbaraFerlinc/SkillsBooster/tree/main/documentation).

## Authors
* Barbara Ferlinc
* Klara Kirbiš
* Jaša Jernej Rakun Kokalj
