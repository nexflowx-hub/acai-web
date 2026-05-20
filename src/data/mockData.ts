// ============================================================
// AÇAÍ DA TERRA — Mock Data (Atlas API Fallback)
// Das Florestas Brasileiras às Praias Portuguesas
// ============================================================

import type {
  Product,
  ModifierGroup,
  ModifierOption,
  Category,
  TimeSlot,
} from "@/types";

// ── Categories ──────────────────────────────────────────────

export const categories: Category[] = [
  { id: "combos", label: "Combos", emoji: "🌴" },
  { id: "custom", label: "Crie o Seu", emoji: "🫐" },
  { id: "gelados", label: "Gelados", emoji: "🍨" },
  { id: "bebidas", label: "Bebidas", emoji: "🥥" },
];

// ── Time Slots ──────────────────────────────────────────────

export const timeSlots: TimeSlot[] = [
  { id: "asap", label: "O mais rápido possível", estimated_minutes: "30-45 min" },
  { id: "ts-1", label: "18:00 - 18:30" },
  { id: "ts-2", label: "18:30 - 19:00" },
  { id: "ts-3", label: "19:00 - 19:30" },
  { id: "ts-4", label: "19:30 - 20:00" },
  { id: "ts-5", label: "20:00 - 20:30" },
  { id: "ts-6", label: "20:30 - 21:00" },
];

// ── Products ────────────────────────────────────────────────

export const products: Product[] = [
  // ─ Combos ─
  {
    id: "combo-tropical",
    name: "Açaí Tropical Bowl",
    description: "Açaí cremoso com banana, manga, granola crocante e mel de coco.",
    base_price: 9.90,
    category: "combos",
    image_url: "/images/combo-tropical.jpg",
    sku: "CMB-TRP-001",
    is_customizable: false,
    tags: ["tropical", "popular"],
  },
  {
    id: "combo-protein",
    name: "Açaí Protein Power",
    description: "Açaí com whey protein, pasta de amendoim, banana e sementes de chia.",
    base_price: 11.50,
    category: "combos",
    image_url: "/images/combo-protein.jpg",
    sku: "CMB-PRT-002",
    is_customizable: false,
    tags: ["proteína", "fitness"],
  },
  {
    id: "combo-berry",
    name: "Açaí Berry Blast",
    description: "Açaí duplo com mirtilos, morangos, framboesas e coco ralado.",
    base_price: 10.90,
    category: "combos",
    image_url: "/images/combo-berry.jpg",
    sku: "CMB-BRY-003",
    is_customizable: false,
    tags: ["frutos vermelhos"],
  },
  {
    id: "combo-green",
    name: "Açaí Green Detox",
    description: "Açaí com espinafre, abacate, maçã verde e sementes de girassol.",
    base_price: 10.50,
    category: "combos",
    image_url: "/images/combo-green.jpg",
    sku: "CMB-GRN-004",
    is_customizable: false,
    tags: ["detox", "verde"],
  },

  // ─ Crie o Seu Açaí ─
  {
    id: "custom-acai",
    name: "Crie o Seu Açaí",
    description: "Personalize o seu açaí dos sonhos em 4 passos simples.",
    base_price: 6.90,
    category: "custom",
    image_url: "/images/custom-acai.jpg",
    sku: "CST-ACI-001",
    is_customizable: true,
    tags: ["personalizável"],
  },

  // ─ Gelados Artesanais ─
  {
    id: "gelado-mango",
    name: "Gelado de Manga Tropical",
    description: "Gelado artesanal de manga alfonso com swirl de maracujá.",
    base_price: 4.50,
    category: "gelados",
    image_url: "/images/gelado-mango.jpg",
    sku: "GLD-MNG-001",
    is_customizable: false,
    tags: ["manga", "tropical"],
  },
  {
    id: "gelado-coco",
    name: "Gelado de Coco Queimado",
    description: "Gelado de coco tostado com raspa de lima e caramelo salgado.",
    base_price: 4.50,
    category: "gelados",
    image_url: "/images/gelado-coco.jpg",
    sku: "GLD-CCO-002",
    is_customizable: false,
    tags: ["coco", "caramelo"],
  },
  {
    id: "gelado-pistache",
    name: "Gelado de Pistache Siciliano",
    description: "Gelado premium de pistache autêntico com pedaços crocantes.",
    base_price: 5.50,
    category: "gelados",
    image_url: "/images/gelado-pistache.jpg",
    sku: "GLD-PST-003",
    is_customizable: false,
    tags: ["pistache", "premium"],
  },
  {
    id: "gelado-maracuja",
    name: "Gelado de Maracujá Selvagem",
    description: "Gelado azedo-doce de maracujá com calda de frutos da floresta.",
    base_price: 4.90,
    category: "gelados",
    image_url: "/images/gelado-maracuja.jpg",
    sku: "GLD-MRC-004",
    is_customizable: false,
    tags: ["maracujá", "ácido"],
  },

  // ─ Bebidas ─
  {
    id: "bebida-smoothie",
    name: "Smoothie Energético Açaí",
    description: "Smoothie de açaí com banana, guaraná e proteína vegetal.",
    base_price: 6.50,
    category: "bebidas",
    image_url: "/images/bebida-smoothie.jpg",
    sku: "BEB-SMT-001",
    is_customizable: false,
    tags: ["smoothie", "energia"],
  },
  {
    id: "bebida-detox",
    name: "Sumo Detox Verde",
    description: "Sumo prensado a frio de couve, maçã, gengibre e limão.",
    base_price: 5.90,
    category: "bebidas",
    image_url: "/images/bebida-detox.jpg",
    sku: "BEB-DTX-002",
    is_customizable: false,
    tags: ["detox", "verde"],
  },
  {
    id: "bebida-coco",
    name: "Água de Coco Natural",
    description: "Água de coco 100% natural, servida gelada no coco.",
    base_price: 3.90,
    category: "bebidas",
    image_url: "/images/bebida-coco.jpg",
    sku: "BEB-CCO-003",
    is_customizable: false,
    tags: ["coco", "natural"],
  },
];

// ── Modifier Groups (only for custom-acai product) ──────────

export const modifierGroups: ModifierGroup[] = [
  {
    id: "mg-size",
    product_id: "custom-acai",
    name: "Tamanho do Copo",
    step: 1,
    selection_type: "single",
    min_permitted: 1,
    max_permitted: 1,
    is_extra_payable: false,
  },
  {
    id: "mg-creams",
    product_id: "custom-acai",
    name: "Cremes / Bases",
    step: 2,
    selection_type: "multiple",
    min_permitted: 0,
    max_permitted: 2,
    is_extra_payable: false,
  },
  {
    id: "mg-toppings",
    product_id: "custom-acai",
    name: "Toppings Secos",
    step: 3,
    selection_type: "multiple",
    min_permitted: 0,
    max_permitted: 10,
    is_extra_payable: true,
    extra_price_per_unit: 0.50,
    free_allowance: 3,
  },
  {
    id: "mg-sauces",
    product_id: "custom-acai",
    name: "Coberturas / Caldas",
    step: 4,
    selection_type: "multiple",
    min_permitted: 0,
    max_permitted: 2,
    is_extra_payable: false,
  },
];

// ── Modifier Options ────────────────────────────────────────

export const modifierOptions: ModifierOption[] = [
  // ─ Step 1: Sizes ─
  { id: "opt-300ml", group_id: "mg-size", name: "300 ml — Base", additional_cost: 0, in_stock: true },
  { id: "opt-500ml", group_id: "mg-size", name: "500 ml", additional_cost: 1.50, in_stock: true },
  { id: "opt-700ml", group_id: "mg-size", name: "700 ml", additional_cost: 3.00, in_stock: true },

  // ─ Step 2: Creams/Bases ─
  { id: "opt-acai-classic", group_id: "mg-creams", name: "Açaí Clássico", additional_cost: 0, in_stock: true },
  { id: "opt-acai-banana", group_id: "mg-creams", name: "Açaí com Banana", additional_cost: 0, in_stock: true },
  { id: "opt-acai-morango", group_id: "mg-creams", name: "Açaí com Morango", additional_cost: 0.50, in_stock: true },
  { id: "opt-creme-coco", group_id: "mg-creams", name: "Creme de Coco", additional_cost: 0.50, in_stock: true },
  { id: "opt-iogurte-natural", group_id: "mg-creams", name: "Iogurte Natural", additional_cost: 0, in_stock: true },

  // ─ Step 3: Dry Toppings ─
  { id: "opt-granola", group_id: "mg-toppings", name: "Granola Crocante", additional_cost: 0, in_stock: true },
  { id: "opt-banana-slice", group_id: "mg-toppings", name: "Banana Fatiada", additional_cost: 0, in_stock: true },
  { id: "opt-morango-slice", group_id: "mg-toppings", name: "Morango", additional_cost: 0, in_stock: true },
  { id: "opt-kiwi", group_id: "mg-toppings", name: "Kiwi", additional_cost: 0, in_stock: true },
  { id: "opt-coco-ralado", group_id: "mg-toppings", name: "Coco Ralado", additional_cost: 0, in_stock: true },
  { id: "opt-amendoim", group_id: "mg-toppings", name: "Amendoim Triturado", additional_cost: 0, in_stock: true },
  { id: "opt-chaia", group_id: "mg-toppings", name: "Sementes de Chia", additional_cost: 0, in_stock: true },
  { id: "opt-leite-poe", group_id: "mg-toppings", name: "Leite em Pó", additional_cost: 0, in_stock: true },
  { id: "opt-aveia", group_id: "mg-toppings", name: "Aveia Crocante", additional_cost: 0, in_stock: true },

  // ─ Step 4: Sauces / Coberturas ─
  { id: "opt-mel", group_id: "mg-sauces", name: "Mel", additional_cost: 0, in_stock: true },
  { id: "opt-choc", group_id: "mg-sauces", name: "Calda de Chocolate", additional_cost: 0.50, in_stock: true },
  { id: "opt-caramelo", group_id: "mg-sauces", name: "Caramelo Salgado", additional_cost: 0.50, in_stock: true },
  { id: "opt-condensado", group_id: "mg-sauces", name: "Leite Condensado", additional_cost: 0.50, in_stock: true },
  { id: "opt-goiabada", group_id: "mg-sauces", name: "Goiabada Derretida", additional_cost: 0.50, in_stock: true },
];

// ── Helpers ─────────────────────────────────────────────────

export function getProductsByCategory(category: Product["category"]): Product[] {
  return products.filter((p) => p.category === category);
}

export function getModifierGroupsForProduct(productId: string): ModifierGroup[] {
  return modifierGroups
    .filter((g) => g.product_id === productId)
    .sort((a, b) => a.step - b.step);
}

export function getOptionsForGroup(groupId: string): ModifierOption[] {
  return modifierOptions.filter((o) => o.group_id === groupId && o.in_stock);
}
