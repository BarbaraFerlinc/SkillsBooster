import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function SeznamKviz({ quizzes }) {
    return (
        <ul>
            {quizzes.map((quiz) => (
                <li key={quiz.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <NavLink
                            to={`/quiz/${quiz.id}`}
                            className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 text-black hover:text-black truncate"
                        >
                            {quiz.name}
                        </NavLink>
                    </div>
                </li>
            ))}
        </ul>
    );
}

SeznamKviz.propTypes = {
    quizzes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default SeznamKviz;
