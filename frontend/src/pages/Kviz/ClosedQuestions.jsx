import React from 'react';
import PropTypes from 'prop-types';

function ClosedQuestion({ question, options, onQuestionChange, onOptionChange, addOption }) {
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
                <label className="block text-lg font-semibold mb-2">Options:</label>
                {options.map((option, index) => (
                    <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => onOptionChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                ))}
                <button
                    onClick={addOption}
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded mt-2"
                >
                    Add Option
                </button>
            </div>
        </div>
    );
}

ClosedQuestion.propTypes = {
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    onQuestionChange: PropTypes.func.isRequired,
    onOptionChange: PropTypes.func.isRequired,
    addOption: PropTypes.func.isRequired,
};

export default ClosedQuestion;
