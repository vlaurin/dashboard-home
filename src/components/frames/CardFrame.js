import React from 'react';

const CardFrame = ({children, title}) => (
    <div className="card bg-white text-dark border-danger">
        <div className="card-header bg-danger text-light">
            {title}
        </div>
        {children}
    </div>
);

export default CardFrame;
