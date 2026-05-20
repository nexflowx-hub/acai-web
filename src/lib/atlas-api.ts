// ============================================================
// Atlas Core Banking API — Headless Storefront Service Layer
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG ?? '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_ATLAS_PUBLIC_KEY ?? '';

interface AtlasHeaders {
  'X-Store-Slug': string;
  'X-Public-Key'?: string;
  'Content-Type'?: string;
}

function getHeaders(includeContentType = false): AtlasHeaders {
  const headers: AtlasHeaders = {
    'X-Store-Slug': STORE_SLUG,
  };
  if (PUBLIC_KEY) {
    headers['X-Public-Key'] = PUBLIC_KEY;
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

// ── Products ─────────────────────────────────────────────

export interface AtlasProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceEur: number;
  images: string[];
  category: string;
  metadata: {
    tags?: string[];
    is_customizable?: boolean;
    sku?: string;
  };
  modifier_groups?: AtlasModifierGroup[];
}

export interface AtlasModifierGroup {
  id: string;
  name: string;
  step: number;
  selection_type: 'single' | 'multiple';
  min_permitted: number;
  max_permitted: number;
  is_extra_payable: boolean;
  extra_price_per_unit?: number;
  free_allowance?: number;
  options: AtlasModifierOption[];
}

export interface AtlasModifierOption {
  id: string;
  name: string;
  additional_cost: number;
  in_stock: boolean;
}

export async function fetchProducts(): Promise<AtlasProduct[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      headers: getHeaders(),
      next: { revalidate: 300 }, // 5 min cache
    });
    if (!res.ok) throw new Error(`Atlas API ${res.status}`);
    const data = await res.json();
    return data.products ?? data;
  } catch (err) {
    console.warn('[Atlas API] Failed to fetch products, using fallback:', err);
    return [];
  }
}

export async function fetchProduct(slug: string): Promise<AtlasProduct | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Atlas API ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[Atlas API] Failed to fetch product:', err);
    return null;
  }
}

// ── Checkout ─────────────────────────────────────────────

export interface CheckoutLineItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  modifiers?: {
    option_id: string;
    quantity: number;
  }[];
}

export interface CheckoutPayload {
  line_items: CheckoutLineItem[];
  delivery_mode: 'delivery' | 'pickup';
  postal_code: string;
  time_slot_id?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSession {
  checkout_url: string;
  session_id: string;
  expires_at: string;
}

export async function createCheckoutSession(
  payload: CheckoutPayload
): Promise<CheckoutSession | null> {
  try {
    const res = await fetch(`${API_URL}/checkout/session`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Atlas Checkout ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[Atlas API] Checkout failed:', err);
    return null;
  }
}
