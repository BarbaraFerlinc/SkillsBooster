import React from 'react';
import PropTypes from 'prop-types';

function OpenQuestion({ question, answer, onQuestionChange, onAnswerChange }) {
    return (
        <div>
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Question:</label>
                <input
                    type="text"
                    value={question}
                    onChange={onQuestionChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Answer:</label>
                <input
                    type="text"
                    value={answer}
                    onChange={onAnswerChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
        </div>
    );
}

OpenQuestion.propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    onQuestionChange: PropTypes.func.isRequired,
    onAnswerChange: PropTypes.func.isRequired,
};

export default OpenQuestion;
