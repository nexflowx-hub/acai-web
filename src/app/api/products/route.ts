// ============================================================
// Products API — Proxy to Atlas Core Banking API
// ============================================================

import { NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/atlas-api';
import { products as fallbackProducts } from '@/data/mockData';

export async function GET() {
  try {
    const atlasProducts = await fetchProducts();

    // If Atlas API returns data, use it; otherwise fall back to mock data
    if (atlasProducts.length > 0) {
      return NextResponse.json({ products: atlasProducts, source: 'atlas' });
    }

    return NextResponse.json({ products: fallbackProducts, source: 'fallback' });
  } catch (error) {
    console.error('[Products API] Error:', error);
    // Always return mock data as fallback
    return NextResponse.json({ products: fallbackProducts, source: 'fallback' });
  }
}
