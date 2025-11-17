import React from 'react';

interface HomepageBodyProps {
    bodyClassName?: string;
    titleClassName?: string;
    children?: React.ReactNode; // Added children prop to allow dynamic content
}

const HomepageBody: React.FC<HomepageBodyProps> = ({ bodyClassName, titleClassName, children }) => {
    return (
        <div className={bodyClassName}>
            <h1 className={titleClassName}>SPORTHUB.</h1>
            {children} {/* Render children directly */}
        </div>
    );
};

export default HomepageBody;
