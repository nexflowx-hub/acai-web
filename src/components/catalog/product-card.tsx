'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBuilderStore } from '@/store/builder-store';
import { useCartStore } from '@/store/cart-store';
import type { Product } from '@/types';
import { ShoppingCart, Palette } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

/** Emoji fallback map by category */
const categoryEmoji: Record<Product['category'], string> = {
  combos: '🌴',
  custom: '🫐',
  gelados: '🍨',
  bebidas: '🥥',
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
      className="organic-border group relative flex flex-col overflow-hidden bg-card py-0 transition-all duration-300 hover:shadow-organic-lg hover:-translate-y-0.5"
    >
      {/* Image section */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br from-acai/20 to-ocean/10">
        {!imgError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            priority={false}
          />
        ) : (
          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
            {categoryEmoji[product.category]}
          </span>
        )}

        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Customizable badge */}
        {product.is_customizable && (
          <Badge
            variant="outline"
            className="absolute right-2 top-2 z-10 border-ocean/40 bg-card/80 text-ocean backdrop-blur-sm"
          >
            <Palette className="mr-1 size-3" />
            Customizável
          </Badge>
        )}

        {/* Popular tag */}
        {product.tags?.includes('popular') && (
          <Badge
            variant="outline"
            className="absolute left-2 top-2 z-10 border-sand/40 bg-card/80 text-sand backdrop-blur-sm"
          >
            ★ Popular
          </Badge>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Product name */}
        <h3 className="text-base font-bold leading-tight text-foreground">
          {product.name}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-lg font-semibold text-acai">
              A partir de {product.base_price.toFixed(2)}&euro;
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              SKU: {product.sku}
            </p>
          </div>
        </div>

        {/* Action button */}
        {product.is_customizable ? (
          <Button
            onClick={handleCustomize}
            className="w-full border border-ocean/30 bg-ocean/10 text-ocean transition-all duration-200 hover:bg-ocean/20 hover:shadow-organic"
            size="sm"
          >
            <Palette className="size-4" />
            Customizar
          </Button>
        ) : (
          <Button
            onClick={handleAddDirectly}
            className="w-full border border-acai/30 bg-acai/10 text-acai transition-all duration-200 hover:bg-acai/20 hover:shadow-organic"
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
