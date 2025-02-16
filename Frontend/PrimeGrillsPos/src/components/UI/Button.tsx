import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
}

const getVariantClasses = (variant: ButtonProps['variant']) => {
    switch (variant) {
        case 'secondary':
            return 'bg-secondary text-white hover:bg-secondary-dark';
        case 'ghost':
            return 'bg-transparent text-primary border border-primary hover:bg-primary-light';
        case 'outline':
            return 'bg-transparent text-primary border border-primary hover:bg-primary-light';
        case 'danger':
            return 'bg-danger text-white hover:bg-danger-dark';
        case 'primary':
        default:
            return 'bg-primary text-white hover:bg-primary-dark';
    }
};

export const Button: React.FC<ButtonProps> = ({ onClick, children, disabled = false, className = '', variant = 'primary' }) => {
    const variantClasses = getVariantClasses(variant);

    return (
        <button 
            onClick={onClick} 
            disabled={disabled} 
            className={`px-4 py-2 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${variantClasses} ${className}`}
        >
            {children}
        </button>
    );
};
