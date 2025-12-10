import React from 'react';
import PropTypes from 'prop-types';

function ClosedQuestion({ question, options, onQuestionChange, onOptionChange, addOption, onAnswerTypeChange, error }) {
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
                <small className="text-red-500">{error}</small>
            </div>
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Options:</label>

                {options.map((option, index) => (
                    <div key={index} className="mb-3">
                        <input
                            type="text"
                            value={option.text}
                            onChange={(e) => onOptionChange(index, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />

                        <label className="text-sm text-gray-600 mt-1 block">Correctness:</label>
                        <select
                            value={option.isCorrect}
                            onChange={(e) => onAnswerTypeChange(index, e.target.value)}
                            className={`p-2 w-full border rounded font-medium
                    ${option.isCorrect === "true" ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"}
                `}
                        >
                            <option value="true">Correct</option>
                            <option value="false">Incorrect</option>
                        </select>
                    </div>
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
    options: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string,
            isCorrect: PropTypes.string,
        })
    ).isRequired,
    onQuestionChange: PropTypes.func.isRequired,
    onOptionChange: PropTypes.func.isRequired,
    addOption: PropTypes.func.isRequired,
    onAnswerTypeChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};

export default ClosedQuestion;
