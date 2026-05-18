'use client';

import { MapPin, Truck, Store } from 'lucide-react';
import { useLocationStore } from '@/store/location-store';
import { CartDrawer } from '@/components/cart/cart-drawer';

interface HeaderProps {
  onLocationClick: () => void;
}

export function Header({ onLocationClick }: HeaderProps) {
  const postalCode = useLocationStore((s) => s.postalCode);
  const mode = useLocationStore((s) => s.mode);
  const isVerified = useLocationStore((s) => s.isVerified);

  const ModeIcon = mode === 'delivery' ? Truck : Store;
  const modeLabel = mode === 'delivery' ? 'Entrega' : 'Levantamento';

  return (
    <header
      className={
        'glass fixed top-0 left-0 right-0 z-50 h-16 md:h-18 ' +
        'border-b border-acai/30 ' +
        'shadow-[0_2px_20px_rgba(124,58,237,0.15)]'
      }
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* ── Left: Brand ────────────────────────────────────── */}
        <div className="flex items-baseline gap-1.5 select-none">
          <span className="text-glow-acai text-xl font-extrabold tracking-wider text-acai md:text-2xl">
            AÇAÍ
          </span>
          <span className="font-mono text-xs tracking-widest text-muted-foreground md:text-sm">
            CONCEPT
          </span>
        </div>

        {/* ── Center: Location Indicator ─────────────────────── */}
        <button
          type="button"
          onClick={onLocationClick}
          className={
            'group flex items-center gap-2 rounded-full px-3 py-1.5 transition-all ' +
            'hover:bg-acai/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acai/50 ' +
            (isVerified ? '' : 'animate-pulse')
          }
          aria-label="Alterar localização de entrega"
        >
          <MapPin
            className={
              'size-4 transition-colors ' +
              (isVerified ? 'text-neon-mint' : 'text-neon-pink')
            }
          />

          <div className="hidden sm:flex flex-col items-start">
            <span className="font-mono text-xs leading-tight text-foreground">
              {postalCode || '-----'}
            </span>
            <span className="flex items-center gap-1 text-[10px] leading-tight text-muted-foreground">
              <ModeIcon className="size-3" />
              {modeLabel}
            </span>
          </div>
        </button>

        {/* ── Right: Cart Drawer (self-contained) ─────────────── */}
        <CartDrawer />
      </div>
    </header>
  );
}
