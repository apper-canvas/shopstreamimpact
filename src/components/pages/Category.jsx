import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '@/components/organisms/ProductGrid';
import ProductFilters from '@/components/organisms/ProductFilters';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { productService } from '@/services/api/productService';

const Category = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: categoryId || '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [productsData, categoriesData] = await Promise.all([
        productService.filterProducts(filters),
        productService.getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: categoryId || '' }));
  }, [categoryId]);

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getCurrentCategoryName = () => {
    if (!categoryId) return 'All Products';
    const category = categories.find(cat => cat.slug === categoryId);
    return category?.name || 'Products';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="h-6 bg-gray-300 rounded shimmer mb-4"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded shimmer"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-8 bg-gray-300 rounded shimmer mb-6"></div>
              <Loading type="products" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getCurrentCategoryName()}
          </h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <Empty
                title="No products found"
                message="Try adjusting your filters or search for different products."
                actionLabel="Clear Filters"
                onAction={() => setFilters({})}
                icon="Search"
              />
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;