// ============================================================
// Builder Store — Açaí Builder Multi-Step State
// ============================================================

import { create } from "zustand";
import type { BuilderStep, BuilderSelection, SelectedModifier, ModifierGroup } from "@/types";
import { getModifierGroupsForProduct, getOptionsForGroup } from "@/data/mockData";

interface BuilderActions {
  open: (productId: string) => void;
  close: () => void;
  setStep: (step: BuilderStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step 1 — single select (size)
  selectSize: (modifier: SelectedModifier) => void;

  // Step 2 — multi select (creams) with max
  toggleCream: (modifier: SelectedModifier, maxAllowed: number) => void;

  // Step 3 — counters (toppings)
  setToppingQuantity: (modifier: SelectedModifier, freeAllowance: number, maxTotal: number) => void;

  // Step 4 — multi select (sauces) with max
  toggleSauce: (modifier: SelectedModifier, maxAllowed: number) => void;

  resetSelections: () => void;
}

interface BuilderState {
  isOpen: boolean;
  productId: string | null;
  currentStep: BuilderStep;
  groups: ModifierGroup[];
  selections: BuilderSelection;
}

const emptySelections: BuilderSelection = {
  step1_size: null,
  step2_creams: [],
  step3_toppings: [],
  step4_sauces: [],
};

export const useBuilderStore = create<BuilderState & BuilderActions>()((set, get) => ({
  isOpen: false,
  productId: null,
  currentStep: 1,
  groups: [],
  selections: { ...emptySelections },

  open: (productId) => {
    const groups = getModifierGroupsForProduct(productId);
    set({
      isOpen: true,
      productId,
      currentStep: 1,
      groups,
      selections: { ...emptySelections },
    });
  },

  close: () => set({ isOpen: false, productId: null }),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, 4) as BuilderStep,
    })),

  prevStep: () =>
    set((s) => ({
      currentStep: Math.max(s.currentStep - 1, 1) as BuilderStep,
    })),

  selectSize: (modifier) =>
    set((s) => ({
      selections: { ...s.selections, step1_size: modifier },
    })),

  toggleCream: (modifier, maxAllowed) =>
    set((s) => {
      const current = s.selections.step2_creams;
      const exists = current.find((c) => c.option_id === modifier.option_id);
      let next: SelectedModifier[];

      if (exists) {
        next = current.filter((c) => c.option_id !== modifier.option_id);
      } else {
        if (current.length >= maxAllowed) return s;
        next = [...current, modifier];
      }

      return { selections: { ...s.selections, step2_creams: next } };
    }),

  setToppingQuantity: (modifier, freeAllowance, maxTotal) =>
    set((s) => {
      const current = s.selections.step3_toppings;
      const existing = current.find((t) => t.option_id === modifier.option_id);

      let next: SelectedModifier[];

      if (modifier.quantity === 0) {
        next = current.filter((t) => t.option_id !== modifier.option_id);
      } else if (existing) {
        if (modifier.quantity > maxTotal) return s;
        next = current.map((t) =>
          t.option_id === modifier.option_id ? { ...t, quantity: modifier.quantity } : t
        );
      } else {
        if (current.length >= maxTotal) return s;
        next = [...current, { ...modifier, quantity: modifier.quantity }];
      }

      return { selections: { ...s.selections, step3_toppings: next } };
    }),

  toggleSauce: (modifier, maxAllowed) =>
    set((s) => {
      const current = s.selections.step4_sauces;
      const exists = current.find((c) => c.option_id === modifier.option_id);
      let next: SelectedModifier[];

      if (exists) {
        next = current.filter((c) => c.option_id !== modifier.option_id);
      } else {
        if (current.length >= maxAllowed) return s;
        next = [...current, modifier];
      }

      return { selections: { ...s.selections, step4_sauces: next } };
    }),

  resetSelections: () => set({ selections: { ...emptySelections }, currentStep: 1 }),
}));

// ── Derived price calculation ───────────────────────────────

export function calculateBuilderPrice(
  basePrice: number,
  selections: BuilderSelection,
  groups: ModifierGroup[]
): number {
  let total = basePrice;

  // Step 1: Size additional cost
  if (selections.step1_size) {
    total += selections.step1_size.additional_cost;
  }

  // Step 2: Creams additional costs
  for (const cream of selections.step2_creams) {
    total += cream.additional_cost;
  }

  // Step 3: Toppings — free allowance + extra pricing
  const toppingsGroup = groups.find((g) => g.step === 3);
  const freeAllowance = toppingsGroup?.free_allowance ?? 3;
  const extraPrice = toppingsGroup?.extra_price_per_unit ?? 0.5;

  const totalToppingUnits = selections.step3_toppings.reduce(
    (sum, t) => sum + t.quantity,
    0
  );
  const extraUnits = Math.max(0, totalToppingUnits - freeAllowance);
  total += extraUnits * extraPrice;

  // Step 4: Sauces additional costs
  for (const sauce of selections.step4_sauces) {
    total += sauce.additional_cost;
  }

  return total;
}
