'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/mockData';
import { ProductCard } from '@/components/catalog/product-card';
import { Leaf } from 'lucide-react';

interface ProductGridProps {
  activeCategory: string;
}

export function ProductGrid({ activeCategory }: ProductGridProps) {
  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <section className="px-4 py-6 sm:px-6" aria-label="Produtos">
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: 'easeOut',
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${activeCategory}`}
            className="flex flex-col items-center justify-center gap-4 py-20 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Leaf className="size-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Sem produtos disponíveis
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Esta categoria ainda não tem produtos. Volta em breve!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
