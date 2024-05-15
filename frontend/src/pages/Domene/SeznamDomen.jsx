import React from 'react';
import PropTypes from 'prop-types';

function SeznamDomen({ domains }) {
    return (
        <div>
            {domains.map((domain) => (
                <div key={domain.id}>
                    <h3>{domain.name}</h3>
                    {/* Render other domain details here */}
                </div>
            ))}
        </div>
    );
}

SeznamDomen.propTypes = {
    domains: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            // Add other propTypes for domain properties here
        })
    ).isRequired,
};

export default SeznamDomen;
