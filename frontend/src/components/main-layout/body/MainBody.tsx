import React from 'react';
import clsx from "clsx";


interface Props {
    bodyClassName?: string; // Class for the body container
    children?: React.ReactNode; // Content to render inside the body
}

const MainPageBody: React.FC<Props> = ({ bodyClassName, children }) => {
    return (
        <div className={clsx(bodyClassName)}>
            {children}
        </div>
    );
}

export default React.memo(MainPageBody);
