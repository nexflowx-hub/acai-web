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

  const getNextUnitCost = (optionId: string) => {
    const currentQty = getQuantity(optionId);
    if (currentQty + 1 <= FREE_ALLOWANCE) return 0;
    return EXTRA_PRICE;
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
            className="border-forest/30 bg-forest/10 text-forest"
          >
            {FREE_ALLOWANCE} grátis
          </Badge>
          {extraUnits > 0 && (
            <Badge
              variant="outline"
              className="border-coral/30 bg-coral/10 text-coral"
            >
              +{extraUnits} extra
            </Badge>
          )}
        </div>
      </div>

      {freeRemaining > 0 && (
        <p className="text-xs text-muted-foreground">
          Ainda pode adicionar{' '}
          <span className="font-medium text-forest">{freeRemaining}</span>{' '}
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
                  ? 'border-acai/20 bg-acai/5'
                  : 'border-border bg-card hover:border-acai/15'
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
                  <span className="text-xs text-coral">
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
                      ? 'border-acai/30 text-acai hover:bg-acai/5'
                      : 'cursor-not-allowed border-border text-muted-foreground/40'
                  )}
                >
                  <Minus className="size-3.5" />
                </button>

                <span
                  className={cn(
                    'w-8 text-center text-sm font-medium tabular-nums',
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
                      : 'border-acai/30 text-acai hover:bg-acai/5'
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
