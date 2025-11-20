import React from 'react';
import clsx from 'clsx';

interface HomepageBodyProps {
    bodyClassName?: string; // Class for the body container
    titleClassName?: string; // Class for the title
    title?: string; // Title text, default to "SPORTHUB."
    children?: React.ReactNode; // Content to render inside the body
}

const HomepageBody: React.FC<HomepageBodyProps> = ({
    bodyClassName,
    titleClassName,
    title = "SPORTHUB.", // Default title
    children
}) => {
    return (
        <div className={clsx(bodyClassName)}>
            <h1 className={clsx(titleClassName)}>{title}</h1>
            {children}
        </div>
    );
};

export default React.memo(HomepageBody);
