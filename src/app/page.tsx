'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { GeofencingModal } from '@/components/layout/geofencing-modal';
import { CategoryNav } from '@/components/catalog/category-nav';
import { ProductGrid } from '@/components/catalog/product-grid';
import { AcaiBuilder } from '@/components/builder/acai-builder';
import { useLocationStore } from '@/store/location-store';
import { motion } from 'framer-motion';
import { Palmtree, Waves } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('combos');
  const [geoModalOpen, setGeoModalOpen] = useState(false);
  const isVerified = useLocationStore((s) => s.isVerified);

  useEffect(() => {
    if (!isVerified) {
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
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
        {/* Organic background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-acai/5 blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-ocean/5 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-sand/5 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-7xl text-center"
        >
          {/* Tagline */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-acai/20 bg-acai/5 px-4 py-1.5">
            <Palmtree className="size-4 text-forest" />
            <span className="text-xs font-medium text-foreground">
              Da Amazónia para o Atlântico
            </span>
            <Waves className="size-4 text-ocean" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-acai">Açaí da Terra</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground sm:text-lg">
            Das florestas brasileiras até às praias portuguesas —
            açaí artesanal, natural e feito com alma.
          </p>

          {/* Organic divider */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-acai/30" />
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🌿</span>
              <span className="text-sm">🌊</span>
              <span className="text-sm">🫐</span>
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-ocean/30" />
          </div>
        </motion.div>
      </section>

      {/* ── Product Catalog ─────────────────────────────────── */}
      <main className="flex-1 pb-12">
        <ProductGrid activeCategory={activeCategory} />
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-acai">
                Açaí da Terra
              </span>
              <span className="text-xs text-muted-foreground">
                🌿 Das florestas às praias
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Açaí da Terra — Todos os direitos reservados
            </p>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-forest/60" />
              <span className="text-[10px] text-muted-foreground">
                Feito com amor em Portugal
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
