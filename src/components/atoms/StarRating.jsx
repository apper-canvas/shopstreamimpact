import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StarRating = ({ rating = 0, maxRating = 5, showCount = false, reviewCount = 0, size = 16 }) => {
  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <ApperIcon
        key={i}
        name="Star"
        size={size}
        className={i <= rating ? 'text-accent fill-current' : 'text-gray-300'}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars}
      </div>
      {showCount && reviewCount > 0 && (
        <span className="text-sm text-gray-500 ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default StarRating;