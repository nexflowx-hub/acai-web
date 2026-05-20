'use client';

import { MapPin, Truck, Store, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLocationStore } from '@/store/location-store';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onLocationClick: () => void;
}

export function Header({ onLocationClick }: HeaderProps) {
  const postalCode = useLocationStore((s) => s.postalCode);
  const mode = useLocationStore((s) => s.mode);
  const isVerified = useLocationStore((s) => s.isVerified);
  const { theme, setTheme } = useTheme();

  const ModeIcon = mode === 'delivery' ? Truck : Store;
  const modeLabel = mode === 'delivery' ? 'Entrega' : 'Levantamento';

  return (
    <header
      className={
        'glass fixed top-0 left-0 right-0 z-50 h-16 md:h-18 ' +
        'border-b border-border/60 ' +
        'shadow-organic'
      }
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* ── Left: Brand ────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 select-none">
          <span className="text-xl font-bold tracking-tight text-acai md:text-2xl">
            Açaí da Terra
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground">
            🌿
          </span>
        </div>

        {/* ── Center: Location Indicator ─────────────────────── */}
        <button
          type="button"
          onClick={onLocationClick}
          className={
            'group flex items-center gap-2 rounded-full px-3 py-1.5 transition-all ' +
            'hover:bg-acai/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acai/30 ' +
            (isVerified ? '' : 'animate-pulse')
          }
          aria-label="Alterar localização de entrega"
        >
          <MapPin
            className={
              'size-4 transition-colors ' +
              (isVerified ? 'text-forest' : 'text-coral')
            }
          />

          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs leading-tight text-foreground">
              {postalCode || '-----'}
            </span>
            <span className="flex items-center gap-1 text-[10px] leading-tight text-muted-foreground">
              <ModeIcon className="size-3" />
              {modeLabel}
            </span>
          </div>
        </button>

        {/* ── Right: Theme toggle + Cart ─────────────────────── */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="size-9 text-muted-foreground hover:text-foreground"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
