'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';

interface CartIconProps {
  onClick: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative hover:glow-acai-sm transition-shadow duration-300"
      aria-label={`Carrinho com ${totalItems} itens`}
    >
      <ShoppingCart className="size-5 text-foreground" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-neon-pink text-white text-[11px] font-bold leading-none">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Button>
  );
}
