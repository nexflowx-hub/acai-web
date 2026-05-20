// ============================================================
// Atlas Core Banking — Webhook Handler
// Receives async payment confirmation events from Atlas
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// In production, you would validate the webhook signature:
// const ATLAS_WEBHOOK_SECRET = process.env.ATLAS_WEBHOOK_SECRET ?? '';

interface AtlasWebhookEvent {
  event: 'payment.confirmed' | 'payment.failed' | 'order.created' | 'order.cancelled';
  order_id: string;
  session_id: string;
  amount_paid: number;
  currency: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AtlasWebhookEvent = await request.json();

    // TODO: Validate webhook signature in production
    // const signature = request.headers.get('x-atlas-signature');
    // if (!validateSignature(body, signature, ATLAS_WEBHOOK_SECRET)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    console.log('[Atlas Webhook] Received event:', body.event, 'Order:', body.order_id);

    switch (body.event) {
      case 'payment.confirmed':
        // TODO: Update order status in your database
        // await db.order.update({ where: { id: body.order_id }, data: { status: 'paid' } });
        console.log(`[Atlas Webhook] Payment confirmed for order ${body.order_id}: €${body.amount_paid}`);
        break;

      case 'payment.failed':
        // TODO: Handle failed payment
        console.log(`[Atlas Webhook] Payment failed for order ${body.order_id}`);
        break;

      case 'order.created':
        // TODO: Handle new order
        console.log(`[Atlas Webhook] Order created: ${body.order_id}`);
        break;

      case 'order.cancelled':
        // TODO: Handle cancelled order
        console.log(`[Atlas Webhook] Order cancelled: ${body.order_id}`);
        break;

      default:
        console.warn('[Atlas Webhook] Unknown event:', body.event);
    }

    // Atlas expects a 200 response to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Atlas Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'atlas-webhook' });
}
