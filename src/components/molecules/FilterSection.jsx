import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterSection = ({ title, children, isOpen = true, onToggle }) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-0 h-auto text-left"
        onClick={onToggle}
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-gray-500"
        />
      </Button>
      
      {isOpen && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;