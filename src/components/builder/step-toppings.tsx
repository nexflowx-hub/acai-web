'use client';

import { Minus, Plus } from 'lucide-react';
import { getOptionsForGroup } from '@/data/mockData';
import { useBuilderStore } from '@/store/builder-store';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SelectedModifier } from '@/types';

const FREE_ALLOWANCE = 3;
const MAX_TOTAL = 10;
const EXTRA_PRICE = 0.5;

export function StepToppings() {
  const options = getOptionsForGroup('mg-toppings');
  const setToppingQuantity = useBuilderStore((s) => s.setToppingQuantity);
  const selectedToppings = useBuilderStore((s) => s.selections.step3_toppings);

  const totalUnits = selectedToppings.reduce((sum, t) => sum + t.quantity, 0);
  const freeRemaining = Math.max(0, FREE_ALLOWANCE - totalUnits);
  const extraUnits = Math.max(0, totalUnits - FREE_ALLOWANCE);

  const getQuantity = (optionId: string) =>
    selectedToppings.find((t) => t.option_id === optionId)?.quantity ?? 0;

  const handleIncrement = (option: (typeof options)[number]) => {
    const currentQty = getQuantity(option.id);
    const newQty = Math.min(currentQty + 1, MAX_TOTAL);

    if (newQty === currentQty) return;

    const modifier: SelectedModifier = {
      option_id: option.id,
      group_id: option.group_id,
      name: option.name,
      additional_cost: option.additional_cost,
      quantity: newQty,
    };
    setToppingQuantity(modifier, FREE_ALLOWANCE, MAX_TOTAL);
  };

  const handleDecrement = (option: (typeof options)[number]) => {
    const currentQty = getQuantity(option.id);
    const newQty = Math.max(currentQty - 1, 0);

    const modifier: SelectedModifier = {
      option_id: option.id,
      group_id: option.group_id,
      name: option.name,
      additional_cost: option.additional_cost,
      quantity: newQty,
    };
    setToppingQuantity(modifier, FREE_ALLOWANCE, MAX_TOTAL);
  };

  // Calculate the cost for a given unit index (1-based)
  // Units 1..FREE_ALLOWANCE are free, after that each costs EXTRA_PRICE
  const getUnitExtraCost = (unitIndex: number) => {
    if (unitIndex <= FREE_ALLOWANCE) return 0;
    return EXTRA_PRICE;
  };

  // For a specific topping, what's the extra cost of the next unit?
  const getNextUnitCost = (optionId: string) => {
    const currentQty = getQuantity(optionId);
    return getUnitExtraCost(currentQty + 1);
  };

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Adicione os toppings que desejar
        </p>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-neon-mint/30 bg-neon-mint/10 text-neon-mint"
          >
            {FREE_ALLOWANCE} grátis
          </Badge>
          {extraUnits > 0 && (
            <Badge
              variant="outline"
              className="border-neon-pink/30 bg-neon-pink/10 text-neon-pink"
            >
              +{extraUnits} extra
            </Badge>
          )}
        </div>
      </div>

      {freeRemaining > 0 && (
        <p className="text-xs text-muted-foreground">
          Ainda pode adicionar{' '}
          <span className="font-medium text-neon-mint">{freeRemaining}</span>{' '}
          {freeRemaining === 1 ? 'topping gratuito' : 'toppings gratuitos'}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const qty = getQuantity(option.id);
          const isActive = qty > 0;
          const nextCost = getNextUnitCost(option.id);

          return (
            <div
              key={option.id}
              className={cn(
                'flex items-center justify-between rounded-xl border px-4 py-3 transition-colors',
                isActive
                  ? 'border-acai/30 bg-acai/5'
                  : 'border-border bg-surface-light hover:border-acai/20'
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-foreground' : 'text-foreground/80'
                  )}
                >
                  {option.name}
                </span>
                {isActive && nextCost > 0 && (
                  <span className="font-mono text-xs text-neon-pink">
                    +{nextCost.toFixed(2)}&euro; / unidade extra
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleDecrement(option)}
                  disabled={qty === 0}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border transition-colors',
                    qty > 0
                      ? 'border-acai/50 text-acai hover:bg-acai/10'
                      : 'cursor-not-allowed border-border text-muted-foreground/40'
                  )}
                >
                  <Minus className="size-3.5" />
                </button>

                <span
                  className={cn(
                    'w-8 text-center font-mono text-sm font-medium',
                    isActive ? 'text-acai' : 'text-muted-foreground'
                  )}
                >
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => handleIncrement(option)}
                  disabled={totalUnits >= MAX_TOTAL}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border transition-colors',
                    totalUnits >= MAX_TOTAL
                      ? 'cursor-not-allowed border-border text-muted-foreground/40'
                      : 'border-acai/50 text-acai hover:bg-acai/10'
                  )}
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
