import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function SeznamDomen({ domains }) {
    return (
        <ul>
            {domains.map((domain) => (
                <li key={domain.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <NavLink
                            to={`/domena/${domain.id}`}
                            className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 text-slate-200 hover:text-white truncate"
                        >
                            {domain.name}
                        </NavLink>
                    </div>
                </li>
            ))}
        </ul>
    );
}

SeznamDomen.propTypes = {
    domains: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default SeznamDomen;
