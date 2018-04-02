import React from 'react';

const CardFrame = ({children, title}) => (
    <div className="card bg-white text-dark border-primary">
        <div className="card-header bg-primary text-light">
            {title}
        </div>
        {children}
    </div>
);

export default CardFrame;
