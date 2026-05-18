'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartIcon } from '@/components/cart/cart-icon';
import { useCartStore } from '@/store/cart-store';
import { useLocationStore } from '@/store/location-store';

function formatPrice(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function CartDrawer() {
  const [open, setOpen] = useState(false);

  const items = useCartStore((s) => s.items);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const mode = useLocationStore((s) => s.mode);
  const selectedTimeSlot = useLocationStore((s) => s.selectedTimeSlot);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const isEmpty = items.length === 0;

  return (
    <>
      <CartIcon onClick={() => setOpen(true)} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex flex-col bg-surface sm:max-w-md w-full border-l border-acai/20"
        >
          {/* ── Header ─────────────────────────────────── */}
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle className="text-xl font-bold text-glow-acai text-acai">
              🫐 O Seu Carrinho
            </SheetTitle>
            <SheetDescription className="sr-only">
              Os itens selecionados no seu carrinho
            </SheetDescription>
            {totalItems > 0 && (
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </p>
            )}
          </SheetHeader>

          <Separator className="bg-acai/15" />

          {/* ── Body ───────────────────────────────────── */}
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">
              <span className="text-5xl">🫐</span>
              <p className="text-lg font-medium text-muted-foreground">
                O seu carrinho está vazio
              </p>
              <p className="text-sm text-muted-foreground/70 text-center">
                Explore o nosso menu e monte o seu açaí dos sonhos!
              </p>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="mt-2 border-acai/30 text-acai hover:bg-acai/10"
              >
                Ver Menu
              </Button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col min-h-0">
              {/* ── Clear Cart Button ────────────────── */}
              <div className="flex justify-end px-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3 mr-1" />
                  Limpar tudo
                </Button>
              </div>

              {/* ── Items List ──────────────────────── */}
              <div className="max-h-[60vh] overflow-y-auto px-4 py-2 space-y-3">
                {items.map((item) => {
                  const unitPrice = item.total_price / item.quantity;

                  return (
                    <div
                      key={item.cart_item_id}
                      className="bg-surface-light rounded-lg p-3 neon-border"
                    >
                      {/* Item top row: name + remove */}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-foreground leading-tight">
                          {item.product_name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.cart_item_id)}
                          aria-label={`Remover ${item.product_name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>

                      {/* Modifier details */}
                      {item.modifiers.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {item.modifiers.map((m) => m.name).join(' · ')}
                        </p>
                      )}

                      {/* Price + quantity controls */}
                      <div className="mt-2.5 flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-md border border-acai/20 text-acai hover:bg-acai/10 hover:border-acai/40"
                            onClick={() =>
                              updateQuantity(item.cart_item_id, item.quantity - 1)
                            }
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold text-foreground tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-md border border-acai/20 text-acai hover:bg-acai/10 hover:border-acai/40"
                            onClick={() =>
                              updateQuantity(item.cart_item_id, item.quantity + 1)
                            }
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>

                        {/* Price info */}
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(unitPrice)} × {item.quantity}
                          </p>
                          <p className="font-mono text-sm font-bold text-acai">
                            €{formatPrice(item.total_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Footer ───────────────────────────────── */}
          {!isEmpty && (
            <SheetFooter className="border-t border-acai/15 bg-surface">
              {/* Subtotal */}
              <div className="flex items-center justify-between w-full py-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-mono text-lg font-bold text-acai">
                  €{formatPrice(totalPrice)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full bg-neon-mint text-surface font-bold hover:bg-neon-mint/90 glow-mint transition-shadow duration-300"
                size="lg"
                onClick={() => {
                  // TODO: Navigate to checkout
                  setOpen(false);
                }}
              >
                <ShoppingCart className="size-4 mr-2" />
                Finalizar Encomenda
              </Button>

              {/* Delivery info */}
              <p className="text-[11px] text-muted-foreground/70 text-center mt-1">
                {mode === 'delivery'
                  ? selectedTimeSlot
                    ? `Entrega estimada: ${selectedTimeSlot.label}`
                    : 'Selecione um horário de entrega'
                  : selectedTimeSlot
                    ? `Recolha estimada: ${selectedTimeSlot.label}`
                    : 'Selecione um horário de recolha'}
              </p>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
