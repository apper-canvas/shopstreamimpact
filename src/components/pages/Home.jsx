import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import ProductCarousel from "@/components/molecules/ProductCarousel";
import CategoryCard from "@/components/molecules/CategoryCard";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [dealOfTheDay, setDealOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

// Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [featured, categoriesData, deals, newArrivals] = await Promise.all([
        productService.getFeatured(),
        productService.getCategories(),
        productService.getDeals(),
        productService.getNewArrivals(),
      ]);

      setFeaturedProducts(featured.slice(0, 12));
      setCategories(categoriesData.filter(cat => cat.featured));
      setDealsProducts(deals.slice(0, 8));
      setNewProducts(newArrivals.slice(0, 4));
      
      // Set deal of the day (highest discount product)
      const bestDeal = deals.reduce((best, current) => {
        const currentDiscount = current.originalPrice ? 
          ((current.originalPrice - current.price) / current.originalPrice) * 100 : 0;
        const bestDiscount = best.originalPrice ? 
          ((best.originalPrice - best.price) / best.originalPrice) * 100 : 0;
        return currentDiscount > bestDiscount ? current : best;
      }, deals[0]);
      
      setDealOfTheDay(bestDeal);
    } catch (err) {
      setError('Failed to load homepage data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12">
            <div className="h-64 bg-gray-300 rounded-lg shimmer mb-8"></div>
            <div className="h-8 bg-gray-300 rounded shimmer w-1/3 mb-4"></div>
            <Loading type="categories" />
          </div>
          <div className="mb-12">
            <div className="h-8 bg-gray-300 rounded shimmer w-1/4 mb-6"></div>
            <Loading type="products" />
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary via-secondary/95 to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
                Shop the Latest
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                  Trends & Deals
                </span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-lg">
                Discover amazing products at unbeatable prices. From electronics to fashion, we have everything you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Shop Now
                  <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
                  View Deals
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-24 object-cover rounded-md mb-2"
                    />
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {product.title}
                    </p>
                    <p className="text-primary font-bold">
                      ${product.price}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deal of the Day */}
        {dealOfTheDay && (
          <section className="py-16">
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-2">🔥 Deal of the Day</h2>
                  <p className="text-xl opacity-90">Limited time offer - Don't miss out!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-bold mb-4 line-clamp-2">
                      {dealOfTheDay.title}
                    </h3>
                    
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                      <span className="text-4xl font-bold">
                        ${dealOfTheDay.price}
                      </span>
                      {dealOfTheDay.originalPrice && (
                        <div className="text-center">
                          <span className="text-xl line-through opacity-75 block">
                            ${dealOfTheDay.originalPrice}
                          </span>
                          <span className="text-sm bg-white/20 px-2 py-1 rounded">
                            Save ${(dealOfTheDay.originalPrice - dealOfTheDay.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <p className="text-lg mb-2">⏰ Offer ends in:</p>
                      <div className="flex justify-center lg:justify-start gap-4">
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                          <div className="text-sm opacity-75">Hours</div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                          <div className="text-sm opacity-75">Minutes</div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                          <div className="text-sm opacity-75">Seconds</div>
                        </div>
                      </div>
                    </div>

                    <Link to={`/product/${dealOfTheDay.Id}`}>
                      <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                        Shop Now - Limited Stock!
                        <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <img
                        src={dealOfTheDay.images[0]}
                        alt={dealOfTheDay.title}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </section>

{/* Featured Products Carousel */}
        <section className="py-16 bg-white rounded-lg shadow-sm">
          <div className="px-6">
            <ProductCarousel 
              products={featuredProducts}
              title="Featured Products"
              showDots={true}
              showArrows={true}
              autoPlay={true}
              autoPlayInterval={6000}
              itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
            />
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Handpicked products that our customers love most
            </p>
            <Link to="/category/electronics">
              <Button size="lg" variant="outline">
                View All Products
                <ApperIcon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

{/* Special Deals Carousel */}
        <section className="py-16">
          <ProductCarousel 
            products={dealsProducts}
            title="🏷️ Special Deals"
            showDots={true}
            showArrows={true}
            autoPlay={false}
            itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          />
          
          <div className="text-center mt-8">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these limited-time offers
            </p>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 bg-white rounded-lg shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out the latest additions to our collection
            </p>
          </div>
          
          <div className="px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product, index) => (
                <motion.div
                  key={product.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-secondary to-secondary/90 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Our Newsletter
            </h2>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Get the latest deals, product updates, and exclusive offers delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border-0 focus:ring-2 focus:ring-accent focus:outline-none text-gray-900"
              />
              <Button className="bg-accent hover:bg-accent/90">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;