'use client';

import { useRef } from 'react';
import { categories } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleClick = (categoryId: string) => {
    onCategoryChange(categoryId);

    // Smooth scroll the clicked pill into view
    if (scrollRef.current) {
      const buttonEl = scrollRef.current.querySelector(
        `[data-category="${categoryId}"]`
      ) as HTMLElement | null;
      if (buttonEl) {
        buttonEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  return (
    <nav
      className="glass sticky top-16 z-40 border-b border-border/50"
      aria-label="Categorias de produtos"
    >
      <div
        ref={scrollRef}
        className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              data-category={category.id}
              onClick={() => handleClick(category.id)}
              aria-pressed={isActive}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-sm transition-all duration-300',
                isActive
                  ? 'border-acai bg-acai text-white glow-acai-sm shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                  : 'border-border/40 bg-transparent text-muted-foreground hover:border-acai/40 hover:text-foreground'
              )}
            >
              <span className="text-base" role="img" aria-hidden="true">
                {category.emoji}
              </span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
