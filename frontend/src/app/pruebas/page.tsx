'use client';

import React from "react";
import {Button} from "@/components/common/button/Button";
import FormButton from "@/components/common/button/form-button/FormButton";

const TestPage: React.FC = () => {
    return (
        <div>
            <h1>Test Page</h1>
            <Button size="small"> Primary Button</Button>

            <FormButton size="small"> Form Button</FormButton>
        </div>
    );
};

export default TestPage;
