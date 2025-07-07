import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ className = "", placeholder = "Search products..." }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-12"
      />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8"
      >
        <ApperIcon name="Search" size={16} />
      </Button>
    </form>
  );
};

export default SearchBar;