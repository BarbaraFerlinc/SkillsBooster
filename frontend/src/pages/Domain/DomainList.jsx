import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function DomainList({ domains }) {
    return (
        <ul>
            {domains?.map((domain, index) => (
                <li key={domain.id || index} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <NavLink
                            to={`/domain/${domain.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}
                            className="text-md font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 text-slate-200 hover:text-white truncate"
                        >
                            {domain.name}
                        </NavLink>
                    </div>
                </li>
            ))}
        </ul>
    );
}

DomainList.propTypes = {
    domains: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            key_skills: PropTypes.string,
            quizzes: PropTypes.arrayOf(PropTypes.string),
            owner: PropTypes.string,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            results: PropTypes.arrayOf(PropTypes.string),
            employees: PropTypes.arrayOf(PropTypes.string),
            learning_materials: PropTypes.arrayOf(PropTypes.string),
        })
    ).isRequired,
};

export default DomainList;
