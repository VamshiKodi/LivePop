import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className }) => {
    // Snappier ease-out: higher stiffness, appropriate damping
    const spring = useSpring(value, { mass: 0.6, stiffness: 120, damping: 28 });
    const displayValue = useTransform(spring, (current) =>
        Math.round(current).toLocaleString()
    );

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span className={className}>{displayValue}</motion.span>;
};

export default AnimatedNumber;
