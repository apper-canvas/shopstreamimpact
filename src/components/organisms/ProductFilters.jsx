import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import FilterSection from "@/components/molecules/FilterSection";

const ProductFilters = ({ onFilterChange, categories = [], filters = {}, products = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    size: true,
    color: true,
    features: true,
    price: true,
    rating: true,
    availability: true,
  });

  // Extract unique values from products
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  const sizes = [...new Set(products.flatMap(p => p.sizes || []))].sort();
  const colors = [...new Set(products.flatMap(p => p.colors || []))].sort();
  const features = [...new Set(products.flatMap(p => p.features || []))].sort();

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

  const handleMultiSelectChange = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [key]: newValues.length > 0 ? newValues : undefined });
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
<span className="text-sm">In Stock Only</span>
            </label>
          </div>
        </FilterSection>

        {/* Brand Filter */}
        {brands.length > 0 && (
            title="Brand"
            isOpen={openSections.brand}
            onToggle={() => toggleSection('brand')}
          >
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.brands || []).includes(brand)}
                    onChange={() => handleMultiSelectChange('brands', brand)}
                    className="mr-2"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Size Filter */}
        {sizes.length > 0 && (
          <FilterSection
            title="Size"
            isOpen={openSections.size}
            onToggle={() => toggleSection('size')}
          >
            <div className="space-y-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.sizes || []).includes(size)}
                    onChange={() => handleMultiSelectChange('sizes', size)}
                    className="mr-2"
                  />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Color Filter */}
        {colors.length > 0 && (
          <FilterSection
            title="Color"
            isOpen={openSections.color}
            onToggle={() => toggleSection('color')}
          >
            <div className="space-y-2">
              {colors.map((color) => (
                <label key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.colors || []).includes(color)}
                    onChange={() => handleMultiSelectChange('colors', color)}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></div>
                    <span className="text-sm">{color}</span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Features Filter */}
        {features.length > 0 && (
          <FilterSection
            title="Features"
            isOpen={openSections.features}
            onToggle={() => toggleSection('features')}
          >
            <div className="space-y-2">
              {features.slice(0, 10).map((feature) => (
                <label key={feature} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.features || []).includes(feature)}
                    onChange={() => handleMultiSelectChange('features', feature)}
                    className="mr-2"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

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
    </>
  );
};

export default ProductFilters;