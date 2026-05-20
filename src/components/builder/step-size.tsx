'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getOptionsForGroup } from '@/data/mockData';
import { useBuilderStore } from '@/store/builder-store';
import { cn } from '@/lib/utils';
import type { SelectedModifier } from '@/types';

export function StepSize() {
  const options = getOptionsForGroup('mg-size');
  const selectSize = useBuilderStore((s) => s.selectSize);
  const selectedSize = useBuilderStore((s) => s.selections.step1_size);

  const handleSelect = (option: (typeof options)[number]) => {
    const modifier: SelectedModifier = {
      option_id: option.id,
      group_id: option.group_id,
      name: option.name,
      additional_cost: option.additional_cost,
      quantity: 1,
    };
    selectSize(modifier);
  };

  return (
    <div className="flex flex-col gap-3 px-4">
      <p className="text-sm text-muted-foreground">
        Escolha o tamanho do seu açaí
      </p>
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedSize?.option_id === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: isSelected ? 1.02 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'relative flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors',
                isSelected
                  ? 'border-acai bg-acai/5 shadow-organic'
                  : 'border-border bg-card hover:border-acai/30 hover:bg-acai/5'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full border-2 transition-colors',
                    isSelected
                      ? 'border-acai bg-acai text-white'
                      : 'border-muted-foreground/30'
                  )}
                >
                  {isSelected && <Check className="size-3.5" />}
                </div>
                <span
                  className={cn(
                    'font-medium',
                    isSelected ? 'text-foreground' : 'text-foreground/80'
                  )}
                >
                  {option.name}
                </span>
              </div>
              {option.additional_cost > 0 && (
                <span
                  className={cn(
                    'text-sm font-medium',
                    isSelected
                      ? 'text-acai'
                      : 'text-muted-foreground'
                  )}
                >
                  +{option.additional_cost.toFixed(2)}&euro;
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
