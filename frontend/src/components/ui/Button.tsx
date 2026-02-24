import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    glow = true,
    ...props
}) => {
    const baseStyles = "relative px-6 py-2 rounded-lg font-semibold tracking-wide overflow-hidden group transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-accent text-black hover:bg-white",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
        outline: "bg-transparent border border-accent text-accent hover:bg-accent/10"
    };

    const sizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg px-8 py-3"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${glow ? 'shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:shadow-[0_0_25px_rgba(0,242,255,0.6)]' : ''}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
        </motion.button>
    );
};

export default Button;
