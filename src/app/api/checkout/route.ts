// ============================================================
// Checkout API — Creates Atlas Core Banking checkout session
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, type CheckoutPayload } from '@/lib/atlas-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      line_items,
      delivery_mode,
      postal_code,
      time_slot_id,
      customer,
    } = body as {
      line_items: CheckoutPayload['line_items'];
      delivery_mode: CheckoutPayload['delivery_mode'];
      postal_code: string;
      time_slot_id?: string;
      customer?: CheckoutPayload['customer'];
    };

    if (!line_items || line_items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio' },
        { status: 400 }
      );
    }

    if (!postal_code) {
      return NextResponse.json(
        { error: 'Código postal obrigatório' },
        { status: 400 }
      );
    }

    const payload: CheckoutPayload = {
      line_items,
      delivery_mode,
      postal_code,
      time_slot_id,
      customer,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/order/success?session_id={SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/`,
    };

    const session = await createCheckoutSession(payload);

    if (!session) {
      return NextResponse.json(
        { error: 'Falha ao criar sessão de checkout' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      checkout_url: session.checkout_url,
      session_id: session.session_id,
    });

  } catch (error) {
    console.error('[Checkout API] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
