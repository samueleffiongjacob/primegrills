import React from 'react';

export const Card: React.FC<{ 
    children: React.ReactNode; 
    className?: string;
    onClick?: () => void;
}> = ({ children, className, onClick }) => {
    return (
        <div 
            className={`p-4 flex flex-col justify-center ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    return (
        <div className={` p-4 ${className}`}>
            {children}
        </div>
    );
};

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
    return (
        <h2 className={` ${className}`}>
            {children}
        </h2>
    );
};

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
};
