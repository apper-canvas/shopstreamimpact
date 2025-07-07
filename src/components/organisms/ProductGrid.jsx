import React, { useContext } from "react";
import { motion } from "framer-motion";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import ProductCard from "@/components/molecules/ProductCard";

// Create context for QuickView functionality
const QuickViewContext = React.createContext();

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  emptyMessage = "No products found",
  emptyDescription = "Try adjusting your search or filter criteria",
  onQuickView
}) => {
if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Error message={error} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Empty 
          message={emptyMessage}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <QuickViewContext.Provider value={{ onQuickView }}>
      <section className="product-grid-container">
        <motion.div 
          className="product-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard 
                product={product} 
                onQuickView={onQuickView}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </QuickViewContext.Provider>
  );
};

export default ProductGrid;