import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import FilterSection from '@/components/molecules/FilterSection';
import ApperIcon from '@/components/ApperIcon';

const ProductFilters = ({ onFilterChange, categories = [], filters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handlePriceChange = (type, value) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (type === 'min') {
      onFilterChange({ ...filters, minPrice: numValue });
    } else {
      onFilterChange({ ...filters, maxPrice: numValue });
    }
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          <ApperIcon name="Filter" size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block bg-white p-4 rounded-lg shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-primary hover:text-primary/80"
          >
            Clear All
          </Button>
        </div>

        {/* Category Filter */}
        <FilterSection
          title="Category"
          isOpen={openSections.category}
          onToggle={() => toggleSection('category')}
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => handleFilterChange('category', '')}
                className="mr-2"
              />
              <span className="text-sm">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category.Id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.slug}
                  checked={filters.category === category.slug}
                  onChange={() => handleFilterChange('category', category.slug)}
                  className="mr-2"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Filter */}
        <FilterSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection
          title="Rating"
          isOpen={openSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={() => handleFilterChange('rating', rating)}
                  className="mr-2"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      size={14}
                      className={i < rating ? 'text-accent fill-current' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-sm ml-2">& up</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability Filter */}
        <FilterSection
          title="Availability"
          isOpen={openSections.availability}
          onToggle={() => toggleSection('availability')}
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock || false}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
          </div>
        </FilterSection>

        {/* Sort By */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <Select
            value={filters.sortBy || ''}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="newest">Newest Arrivals</option>
          </Select>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;