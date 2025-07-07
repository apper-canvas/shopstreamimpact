import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/organisms/ProductGrid';
import ProductFilters from '@/components/organisms/ProductFilters';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { productService } from '@/services/api/productService';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = searchParams.get('q') || '';

const loadSearchResults = async () => {
    try {
      setLoading(true);
      setError('');

      if (!query.trim()) {
        setProducts([]);
        setAllProducts([]);
        return;
      }

      const [results, categoriesData] = await Promise.all([
        productService.search(query, filters),
        productService.getCategories()
      ]);
      
      setProducts(results);
      setAllProducts(results);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to search products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    
    if (!query.trim()) return;
    
    try {
      const filteredResults = await productService.search(query, newFilters);
      setProducts(filteredResults);
    } catch (err) {
      setError('Failed to filter products. Please try again.');
    }
  };

useEffect(() => {
    loadSearchResults();
  }, [query]);

  useEffect(() => {
    // Reset filters when query changes
    setFilters({});
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-300 rounded shimmer w-1/3 mb-6"></div>
          <Loading type="products" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Error message={error} onRetry={loadSearchResults} />
      </div>
    );
  }

return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
          )}
        </div>

        {!query.trim() ? (
          <Empty
            title="Enter a search term"
            message="Use the search bar above to find products."
            actionLabel="Browse Categories"
            onAction={() => window.history.back()}
            icon="Search"
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <ProductFilters
                onFilterChange={handleFilterChange}
                categories={categories}
                filters={filters}
                products={allProducts}
              />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {products.length === 0 ? (
                <Empty
                  title="No products found"
                  message={`We couldn't find any products matching "${query}" with the selected filters. Try adjusting your filters or different keywords.`}
                  actionLabel="Clear Filters"
                  onAction={() => setFilters({})}
                  icon="Search"
                />
              ) : (
                <ProductGrid products={products} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;