'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useBuilderStore, calculateBuilderPrice } from '@/store/builder-store';
import { useCartStore } from '@/store/cart-store';
import { products } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BuilderFooter() {
  const productId = useBuilderStore((s) => s.productId);
  const selections = useBuilderStore((s) => s.selections);
  const groups = useBuilderStore((s) => s.groups);
  const close = useBuilderStore((s) => s.close);
  const addToCart = useCartStore((s) => s.addItem);

  const product = productId
    ? products.find((p) => p.id === productId)
    : null;
  const basePrice = product?.base_price ?? 0;

  const totalPrice = calculateBuilderPrice(basePrice, selections, groups);
  const hasSize = selections.step1_size !== null;

  const handleAddToCart = () => {
    if (!product || !hasSize) return;

    const modifiers = [
      selections.step1_size!,
      ...selections.step2_creams,
      ...selections.step3_toppings,
      ...selections.step4_sauces,
    ].filter(Boolean);

    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      base_price: product.base_price,
      modifiers,
      total_price: totalPrice,
    });

    close();
  };

  return (
    <div className="border-t border-border/60 bg-card px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Total</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={totalPrice.toFixed(2)}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-acai"
            >
              {totalPrice.toFixed(2)}&euro;
            </motion.span>
          </AnimatePresence>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!hasSize}
          className={cn(
            'gap-2 rounded-xl px-6 font-semibold transition-all',
            hasSize
              ? 'bg-ocean text-white hover:bg-ocean/90 shadow-organic'
              : 'bg-muted text-muted-foreground'
          )}
          size="lg"
        >
          <ShoppingCart className="size-4" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
}
