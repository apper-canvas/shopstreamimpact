import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No items found", 
  message = "We couldn't find what you're looking for.", 
  actionLabel = "Browse Products", 
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onAction && (
          <Button onClick={onAction} className="w-full">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;