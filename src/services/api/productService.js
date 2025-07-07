import categoriesData from "@/services/mockData/categories.json";
import productsData from "@/services/mockData/products.json";

let products = [...productsData];
let categories = [...categoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getAll: async () => {
    await delay(300);
    return [...products];
  },

  getById: async (id) => {
    await delay(200);
    const product = products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  },

  getByCategory: async (categoryId) => {
    await delay(350);
    const categoryProducts = products.filter(p => p.categoryId === categoryId);
    return categoryProducts.map(p => ({ ...p }));
  },

  getFeatured: async () => {
    await delay(250);
    const featuredProducts = products.filter(p => p.featured === true);
    return featuredProducts.map(p => ({ ...p }));
  },

  getDeals: async () => {
    await delay(300);
    const dealsProducts = products.filter(p => p.onSale === true);
    return dealsProducts.map(p => ({ ...p }));
  },

  getNewArrivals: async () => {
    await delay(280);
    const newProducts = products.filter(p => p.isNew === true);
    return newProducts.map(p => ({ ...p }));
  },

  getBestSellers: async () => {
    await delay(320);
    const bestSellers = products.filter(p => p.bestSeller === true);
    return bestSellers.map(p => ({ ...p }));
  },

  getRelated: async (productId, categoryId) => {
    await delay(250);
    const relatedProducts = products.filter(p => 
      p.categoryId === categoryId && p.Id !== parseInt(productId)
    ).slice(0, 4);
    return relatedProducts.map(p => ({ ...p }));
  },

search: async (query, filters = {}) => {
    await delay(300);
    const searchQuery = query.toLowerCase();
    let searchResults = products.filter(p => 
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery)) ||
      (p.features && p.features.some(f => f.toLowerCase().includes(searchQuery)))
    );

    // Apply filters
    searchResults = applyFilters(searchResults, filters);
    return searchResults.map(p => ({ ...p }));
  },

  getCategories: async () => {
    await delay(200);
    return [...categories];
  },

filterProducts: async (filters) => {
    await delay(300);
    let filteredProducts = applyFilters([...products], filters);
    return filteredProducts.map(p => ({ ...p }));
  },

  create: async (product) => {
    await delay(400);
    const newProduct = {
      ...product,
      Id: Math.max(...products.map(p => p.Id)) + 1,
      dateAdded: new Date().toISOString(),
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  update: async (id, updates) => {
    await delay(400);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    products[index] = { ...products[index], ...updates };
    return { ...products[index] };
  },

delete: async (id) => {
    await delay(300);
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    products.splice(index, 1);
    return { success: true };
  },
};

// Helper function to apply filters
const applyFilters = (productList, filters) => {
  let filteredProducts = [...productList];

  if (filters.category) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === filters.category);
  }

  if (filters.brands && filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.brand && filters.brands.includes(p.brand)
    );
  }

  if (filters.sizes && filters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.sizes && p.sizes.some(size => filters.sizes.includes(size))
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.colors && p.colors.some(color => filters.colors.includes(color))
    );
  }

  if (filters.features && filters.features.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.features && p.features.some(feature => filters.features.includes(feature))
    );
  }

  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
  }

  if (filters.rating !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating);
  }

  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(p => p.inStock === true);
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
default:
        break;
    }
  }

  return filteredProducts;
};