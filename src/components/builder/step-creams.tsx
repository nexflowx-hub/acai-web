'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getOptionsForGroup } from '@/data/mockData';
import { useBuilderStore } from '@/store/builder-store';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SelectedModifier } from '@/types';

const MAX_ALLOWED = 2;

export function StepCreams() {
  const options = getOptionsForGroup('mg-creams');
  const toggleCream = useBuilderStore((s) => s.toggleCream);
  const selectedCreams = useBuilderStore((s) => s.selections.step2_creams);

  const selectedCount = selectedCreams.length;
  const isMaxReached = selectedCount >= MAX_ALLOWED;

  const handleToggle = (option: (typeof options)[number]) => {
    const modifier: SelectedModifier = {
      option_id: option.id,
      group_id: option.group_id,
      name: option.name,
      additional_cost: option.additional_cost,
      quantity: 1,
    };
    toggleCream(modifier, MAX_ALLOWED);
  };

  const isSelected = (optionId: string) =>
    selectedCreams.some((c) => c.option_id === optionId);

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Escolha até {MAX_ALLOWED} cremes/base
        </p>
        {isMaxReached && (
          <Badge
            variant="secondary"
            className="border-acai/20 bg-acai/10 text-acai"
          >
            {selectedCount}/{MAX_ALLOWED}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = isSelected(option.id);
          const disabled = !selected && isMaxReached;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleToggle(option)}
              disabled={disabled}
              whileTap={disabled ? undefined : { scale: 0.95 }}
              animate={{
                scale: selected ? 1.05 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                selected
                  ? 'border-acai bg-acai text-white'
                  : disabled
                    ? 'cursor-not-allowed border-border bg-muted opacity-50'
                    : 'border-border bg-card text-foreground/80 hover:border-acai/30 hover:bg-acai/5'
              )}
            >
              {selected && <Check className="size-3.5" />}
              <span>{option.name}</span>
              {option.additional_cost > 0 && (
                <span
                  className={cn(
                    'text-xs',
                    selected ? 'text-white/80' : 'text-muted-foreground'
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
