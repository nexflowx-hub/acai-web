'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { GeofencingModal } from '@/components/layout/geofencing-modal';
import { CategoryNav } from '@/components/catalog/category-nav';
import { ProductGrid } from '@/components/catalog/product-grid';
import { AcaiBuilder } from '@/components/builder/acai-builder';
import { useLocationStore } from '@/store/location-store';
import { motion } from 'framer-motion';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('combos');
  const [geoModalOpen, setGeoModalOpen] = useState(false);
  const isVerified = useLocationStore((s) => s.isVerified);

  // Open geofencing modal automatically if not verified
  useEffect(() => {
    if (!isVerified) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setGeoModalOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isVerified]);

  const handleLocationClick = () => {
    setGeoModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Fixed Header ────────────────────────────────────── */}
      <Header onLocationClick={handleLocationClick} />

      {/* ── Sticky Category Navigation ──────────────────────── */}
      <div className="pt-16 md:pt-18">
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
        {/* Animated background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-acai/5 blur-[120px]" />
          <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-neon-pink/3 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-7xl text-center"
        >
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-glow-acai text-acai">Açaí</span>{' '}
            <span className="text-foreground">de Alta Performance</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Gelados artesanais conceptuais com ingredientes premium.
            Personalize o seu açaí dos sonhos.
          </p>

          {/* Neon divider */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-acai/50" />
            <div className="size-2 rounded-full bg-acai glow-acai-sm" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-acai/50" />
          </div>
        </motion.div>
      </section>

      {/* ── Product Catalog ─────────────────────────────────── */}
      <main className="flex-1 pb-12">
        <ProductGrid activeCategory={activeCategory} />
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-acai/10 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-glow-acai text-sm font-extrabold tracking-wider text-acai">
                AÇAÍ
              </span>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                CONCEPT
              </span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground/50">
              © {new Date().getFullYear()} Açaí Concept — Todos os direitos reservados
            </p>
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-neon-mint/40" />
              <span className="font-mono text-[10px] text-muted-foreground/50">
                SYSTEM ONLINE
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modals & Drawers ────────────────────────────────── */}
      <GeofencingModal open={geoModalOpen} onOpenChange={setGeoModalOpen} />
      <AcaiBuilder />
    </div>
  );
}
