'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBuilderStore } from '@/store/builder-store';
import { useCartStore } from '@/store/cart-store';
import type { Product } from '@/types';
import { ShoppingCart, Settings2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

/** Emoji fallback map by category */
const categoryEmoji: Record<Product['category'], string> = {
  combos: '⚡',
  custom: '🫐',
  gelados: '🍨',
  bebidas: '🥤',
};

export function ProductCard({ product }: ProductCardProps) {
  const openBuilder = useBuilderStore((s) => s.open);
  const addToCart = useCartStore((s) => s.addItem);
  const [imgError, setImgError] = useState(false);

  const handleCustomize = () => {
    openBuilder(product.id);
  };

  const handleAddDirectly = () => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      base_price: product.base_price,
      modifiers: [],
      total_price: product.base_price,
    });
  };

  return (
    <Card
      className="neon-border group relative flex flex-col overflow-hidden bg-surface/80 py-0 transition-all duration-300 hover:scale-[1.02] hover:bg-surface"
    >
      {/* Image section */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-acai to-acai-glow">
        {!imgError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            priority={false}
          />
        ) : (
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
            {categoryEmoji[product.category]}
          </span>
        )}

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Customizable badge */}
        {product.is_customizable && (
          <Badge
            variant="outline"
            className="absolute right-2 top-2 z-10 border-neon-mint/40 bg-surface/60 font-mono text-neon-mint backdrop-blur-sm"
          >
            <Settings2 className="mr-1 size-3" />
            Customizável
          </Badge>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Product name */}
        <h3 className="text-base font-bold leading-tight text-white">
          {product.name}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {/* Price & SKU */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-mono text-lg font-semibold text-acai">
              A partir de {product.base_price.toFixed(2)}&euro;
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/60">
              SKU: {product.sku}
            </p>
          </div>
        </div>

        {/* Action button */}
        {product.is_customizable ? (
          <Button
            onClick={handleCustomize}
            className="w-full border border-neon-mint/40 bg-neon-mint/15 font-mono text-neon-mint transition-all duration-300 hover:bg-neon-mint/25 hover:shadow-[0_0_12px_rgba(52,211,153,0.25)]"
            size="sm"
          >
            <Settings2 className="size-4" />
            Customizar
          </Button>
        ) : (
          <Button
            onClick={handleAddDirectly}
            className="w-full border border-acai/40 bg-acai/15 font-mono text-acai transition-all duration-300 hover:bg-acai/25 hover:shadow-[0_0_12px_rgba(124,58,237,0.25)]"
            size="sm"
          >
            <ShoppingCart className="size-4" />
            Adicionar
          </Button>
        )}
      </div>
    </Card>
  );
}
