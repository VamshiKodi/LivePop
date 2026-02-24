import React from 'react';
import { FaPrint } from 'react-icons/fa';

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ 
  label = 'Print',
  className = ''
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={`no-print flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium ${className}`}
    >
      <FaPrint size={14} />
      {label}
    </button>
  );
};

export default PrintButton;
