import React from 'react'
import clsx from "clsx";


interface Props {
    bodyClassName?: string; // Class for the body container
    titleClassName?: string; // Class for the title
    title?: string; // Title text, default to "SPORTHUB."
    children?: React.ReactNode; // Content to render inside the body
}

const Mainpage: React.FC<Props> = ({ bodyClassName, titleClassName, title='SPORTHUB', children }) => {
    return (
        <div className={clsx(bodyClassName)}>
            <h1 className={clsx(titleClassName)}>{title}</h1>
            {children}
        </div>
    );
}

export default React.memo(Mainpage);
