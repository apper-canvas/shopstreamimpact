import React from 'react';

const Loading = ({ type = 'products' }) => {
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 sm:h-56 bg-gray-300 shimmer"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded shimmer mb-2"></div>
        <div className="h-3 bg-gray-300 rounded shimmer w-3/4 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-300 rounded shimmer w-20"></div>
          <div className="h-8 bg-gray-300 rounded shimmer w-16"></div>
        </div>
      </div>
    </div>
  );

  const CategorySkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-300 shimmer"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded shimmer mb-2"></div>
        <div className="h-3 bg-gray-300 rounded shimmer w-3/4 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-300 rounded shimmer w-16"></div>
          <div className="h-3 bg-gray-300 rounded shimmer w-20"></div>
        </div>
      </div>
    </div>
  );

  const CartSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-md shimmer"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded shimmer mb-2"></div>
          <div className="h-3 bg-gray-300 rounded shimmer w-1/2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-300 rounded shimmer"></div>
          <div className="h-4 w-6 bg-gray-300 rounded shimmer"></div>
          <div className="h-8 w-8 bg-gray-300 rounded shimmer"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-300 rounded shimmer w-16 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded shimmer w-12"></div>
        </div>
      </div>
    </div>
  );

  const ProductDetailSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-96 bg-gray-300 rounded-lg shimmer"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded shimmer"></div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-300 rounded shimmer"></div>
          <div className="h-4 bg-gray-300 rounded shimmer w-1/4"></div>
          <div className="h-6 bg-gray-300 rounded shimmer w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded shimmer"></div>
            <div className="h-4 bg-gray-300 rounded shimmer w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded shimmer w-4/6"></div>
          </div>
          <div className="h-12 bg-gray-300 rounded shimmer"></div>
        </div>
      </div>
    </div>
  );

  if (type === 'product-detail') {
    return <ProductDetailSkeleton />;
  }

  if (type === 'categories') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (type === 'cart') {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <CartSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export default Loading;