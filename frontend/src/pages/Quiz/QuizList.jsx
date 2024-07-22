import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

// lahko zbrišemo ??

function QuizList({ quizzes, domain }) {
    const [currentUser, setCurrentUser] = useState(null);

    const { user } = UserAuth();

    useEffect(() => {
        if (user) {
          const uporabnikovEmail = user.email;
    
          api.post('/uporabnik/profil', { id: uporabnikovEmail })
            .then(res => {
              const profil = res.data;
              setCurrentUser(profil);
            })
            .catch(err => {
              console.error(err);
            });
        }
    }, [user]);

    const handleQuizDelete = (quizName) => {
        const novId = domain.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const kvizId = quizName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        console.log("id: ", novId);
        console.log("kvizId: ", kvizId);
        api.post(`/domena/odstrani-kviz`, { id: novId, kvizId: kvizId })
            .then(res => {
                console.log('Izbrisan kviz: ', quizName);
            })
            .catch(err => {
                console.error(err);
            });
        // more se še odstranit sam kviz in vsa vprašanja in odgovori
    };

    return (
        <ul>
            {quizzes.map((quiz, index) => (
                <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <NavLink
                            to={`/quiz/${quiz}`}
                            className="text-md font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 text-black hover:text-black truncate"
                        >
                            {quiz}
                        </NavLink>
                        {currentUser && (currentUser.vloga === "boss") && (
                            <button 
                                onClick={() => handleQuizDelete(quiz)} 
                                className="btn bg-red-500 hover:bg-red-600 text-white ml-4"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

QuizList.propTypes = {
    quizzes: PropTypes.arrayOf(PropTypes.string).isRequired,
    domain: PropTypes.string.isRequired,
};

export default QuizList;
