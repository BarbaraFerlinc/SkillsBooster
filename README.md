# SkillsBooster
___
### Description
___
Our platform offers a comprehensive tool designed to support companies in 
evaluating and developing their employees' knowledge through customizable
self-assessment questionnaires and AI-generated learning contend.

The solution aids management in ensuring the continuous growth of their team's skills.
### Key functionalities
___
#### * Knowledge Domain Management:
+ Easily add and manage knowledge domains
+ Define and edit key competencies within each domain
#### * Question Management
* User-friendly interface for creating, editing and deleting questions within a domain
* Option to include correct and incorrect answers for each question
* Link questions to theoretical knowledge or relevant learning resources
#### * AI Integration
* AI-powered generation of simple answers
* Analysis of user responses to identify knowledge gaps
* Automated suggestions for knowledge improvement, including learning materials based on incorrect answers.
#### * Learning Material
* Link or upload learning materials such as articles, videos, e-books, or web resources relevant to knowledge enhancement.
* Organize learning materials by domain and specific competencies.
#### * Skills Matrix Generation 
+ Track employee progress and compare knowledge levels
+ Automatically generate and update a Skills Matrix based on employee progress
#### Responsiveness and Accessibility 
+ Intuitive and uer-friendly interface for easy navigation and use
+ Accessible on various devices (computers, tablets and smartphones) with adaptability to different screen sizes.

### Technologies used
___
<div style="width: 100%; text-align: center;">

|                                                                                     React JSX                                                                                     |                                                                               JavaScript                                                                                |                                                                                Python                                                                                |                                                                                   Firebase                                                                                    |                                                                                     OpenAI                                                                                     |
|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | 
| <a href="https://reactjs.org/docs/introducing-jsx.html" title="React JSX"><img src="https://github.com/get-icon/geticon/raw/master/icons/react.svg" alt="React JSX" width="50px" height="50px"></a> | <a href="https://www.javascript.com/" title="JavaScript"><img src="https://github.com/get-icon/geticon/raw/master/icons/javascript.svg" alt="JavaScript" width="50px" height="50px"></a> | <a href="https://www.python.org/" title="Python"><img src="https://github.com/get-icon/geticon/raw/master/icons/python.svg" alt="Python" width="50px" height="50px"></a> | <a href="https://firebase.google.com/" title="Firebase"><img src="https://github.com/get-icon/geticon/raw/master/icons/firebase.svg" alt="Firebase" width="50px" height="50px"></a> | <a href="https://openai.com/" title="OpenAI"><img src="https://assets-global.website-files.com/5e6aa3e3f001fae105b8e1e7/63920ffe0f48f96db746221d_open-ai-logo-8B9BFEDC26-seeklogo.com.png" alt="OpenAI" width="50px" height="50px"></a> |

</div>




## Backend
___
### Installation
___
### Development
___
### Testing
___
### Build
___

## Frontend

### Project setup

```bash
npm install
```

#### Compiles and hot-reloads for development
```bash
npm run dev
```

#### Compiles and minifies for production
```bash
npm run build
```

___
### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/BarbaraFerlinc/SkillsBooster.git
   cd <repository-directory>

Install dependencies in **frontend** directory by running:
````bash
npm install
````

### Development
Create a new file .env in frontend directory
___
1. **Create .env file**
 
Before you can run the development server, you have to create a new **.env** file in **frontend** directory, with following content: 
````
VITE_APP_BASE_URL=

VITE_API_KEY= 
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID= 
VITE_STORAGE_BUCKET= 
VITE_MESSAGING_SENDER_ID= 
VITE_APP_ID= 
````
in the **frontend** directory start the client on port 9000
2. **Start the Development Server:**

   To start the development server, run the following command:

```bash
   npm run dev
```

### Build
To create a production build of the application on the **frontend**, run the following command:

```bash
   npm run build
```