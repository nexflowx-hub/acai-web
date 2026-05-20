// ============================================================
// AÇAÍ DA TERRA — TypeScript Interfaces
// Das Florestas Brasileiras às Praias Portuguesas
// ============================================================

/** Core product in the catalog (Atlas API compatible) */
export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  base_price: number;
  category: "combos" | "custom" | "gelados" | "bebidas";
  image_url: string;
  images?: string[];
  sku: string;
  is_customizable: boolean;
  tags?: string[];
}

/** A group of modifiers tied to a product (e.g., "Tamanho", "Toppings") */
export interface ModifierGroup {
  id: string;
  product_id: string;
  name: string;
  step: number; // 1-4 ordering
  selection_type: "single" | "multiple";
  min_permitted: number;
  max_permitted: number;
  is_extra_payable: boolean;
  extra_price_per_unit?: number;
  free_allowance?: number; // e.g., 3 free toppings before charging
}

/** An individual option within a modifier group */
export interface ModifierOption {
  id: string;
  group_id: string;
  name: string;
  additional_cost: number;
  in_stock: boolean;
}

// ============================================================
// Cart & Builder State Types
// ============================================================

/** Selected modifier attached to a cart item */
export interface SelectedModifier {
  option_id: string;
  group_id: string;
  name: string;
  additional_cost: number;
  quantity: number; // for counter-based modifiers (toppings)
}

/** A fully-configured item in the cart */
export interface CartItem {
  /** Composite hash: product_id + sorted modifier option IDs + quantities */
  cart_item_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  base_price: number;
  modifiers: SelectedModifier[];
  total_price: number;
  quantity: number;
}

// ============================================================
// Location / Delivery Types
// ============================================================

export type DeliveryMode = "delivery" | "pickup";

export interface TimeSlot {
  id: string;
  label: string;
  estimated_minutes?: string;
}

export interface LocationState {
  isVerified: boolean;
  postalCode: string;
  mode: DeliveryMode;
  selectedTimeSlot: TimeSlot | null;
}

// ============================================================
// Builder Step Types
// ============================================================

export type BuilderStep = 1 | 2 | 3 | 4;

export interface BuilderSelection {
  step1_size: SelectedModifier | null;
  step2_creams: SelectedModifier[];
  step3_toppings: SelectedModifier[];
  step4_sauces: SelectedModifier[];
}

// ============================================================
// Category Definition
// ============================================================

export interface Category {
  id: "combos" | "custom" | "gelados" | "bebidas";
  label: string;
  emoji: string;
}
