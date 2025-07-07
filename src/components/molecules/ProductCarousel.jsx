import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';
import ApperIcon from '@/components/ApperIcon';

const ProductCarousel = ({ 
  products = [], 
  title,
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 4 }
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop);

  // Responsive items per view
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(itemsPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerView.tablet);
      } else {
        setItemsToShow(itemsPerView.desktop);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, [itemsPerView]);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || products.length <= itemsToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => 
        prev + itemsToShow >= products.length ? 0 : prev + itemsToShow
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, products.length, itemsToShow]);

  const maxIndex = Math.max(0, products.length - itemsToShow);
  const totalSlides = Math.ceil(products.length / itemsToShow);

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + itemsToShow >= products.length ? 0 : prev + itemsToShow
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.floor(maxIndex / itemsToShow) * itemsToShow : prev - itemsToShow
    );
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex * itemsToShow);
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        </div>
      )}

      <div className="relative overflow-hidden">
        {/* Navigation Arrows */}
        {showArrows && products.length > itemsToShow && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Previous products"
            >
              <ApperIcon name="ChevronLeft" size={20} className="text-gray-600" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Next products"
            >
              <ApperIcon name="ChevronRight" size={20} className="text-gray-600" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex transition-transform duration-300 ease-in-out"
            animate={{
              x: `-${(currentIndex / itemsToShow) * 100}%`
            }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {products.map((product, index) => (
              <div
                key={product.Id}
                className={`flex-shrink-0 px-2 ${
                  itemsToShow === 1 ? 'w-full' :
                  itemsToShow === 2 ? 'w-1/2' :
                  itemsToShow === 3 ? 'w-1/3' : 'w-1/4'
                }`}
                style={{ minWidth: `${100 / itemsToShow}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots Navigation */}
        {showDots && totalSlides > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  Math.floor(currentIndex / itemsToShow) === index
                    ? 'bg-primary'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;