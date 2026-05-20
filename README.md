# 🫐 Açaí da Terra

**Das Florestas Brasileiras às Praias Portuguesas**

Headless e-commerce storefront for premium açaí and artisanal gelados, built with Next.js 16 and integrated with Atlas Core Banking API for payments.

---

## 🌊 Design Philosophy

> _"From the Brazilian forests to the Portuguese beaches"_

The visual identity is inspired by the journey of açaí from the heart of the Amazon to the Atlantic coast of Portugal:

- **Organic & Clean** — Warm cream backgrounds, natural textures, soft shadows
- **Portuguese Beach Vibes** — Ocean teal, sandy gold, coral accents
- **Brazilian Forest Soul** — Deep açaí purple, lush forest green
- **Light-first** — Light mode default with elegant dark mode support

### Color Palette

| Token | Light | Dark | Meaning |
|-------|-------|------|---------|
| `acai` | `#5B2C6F` | `#9B6DCC` | Deep açaí purple (brand) |
| `ocean` | `#0E8C7F` | `#2EC4B6` | Atlantic teal (actions) |
| `sand` | `#D4A853` | `#D4A853` | Beach gold (highlights) |
| `coral` | `#E07A5F` | `#E07A5F` | Warm coral (alerts/cart) |
| `forest` | `#2D6A4F` | `#52B788` | Amazon green (success) |
| `cream` | `#FAF7F2` | `#1A1A1E` | Background |

---

## 🏗️ Architecture

```
┌──────────────────────┐      ┌──────────────────────┐
│   Next.js Frontend   │─────▶│  Atlas Core Banking   │
│   (Headless Store)   │◀─────│  API (Payments/CaaS)  │
└──────────┬───────────┘      └──────────────────────┘
           │                           ▲
           │                           │
           ▼                           │
┌──────────────────────┐              │
│  Zustand (Client)    │     ┌────────┴───────────┐
│  Cart, Builder,      │     │  Webhook Endpoint   │
│  Location Stores     │     │  /api/webhooks/atlas│
└──────────────────────┘     └────────────────────┘
```

### Headless Storefront (No Local DB)

All product data, checkout, and payment flows are handled by the **Atlas Core Banking API**. The frontend is a pure headless consumer.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- An Atlas Core Banking account (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/nexflowx-hub/acai-web.git
cd acai-web

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Atlas API credentials

# Start development server
bun run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_STORE_SLUG` | ✅ | Your Atlas store identifier |
| `NEXT_PUBLIC_API_URL` | ✅ | Atlas API base URL |
| `NEXT_PUBLIC_ATLAS_PUBLIC_KEY` | ✅ | Atlas public key (client-safe) |
| `ATLAS_WEBHOOK_SECRET` | 🔒 | Webhook signature secret (server-only) |

Example `.env`:

```env
NEXT_PUBLIC_STORE_SLUG=acai-da-terra
NEXT_PUBLIC_API_URL=https://api.atlasbanking.io/v1
NEXT_PUBLIC_ATLAS_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
ATLAS_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts        # POST → Atlas checkout session
│   │   ├── products/route.ts        # GET → Atlas products proxy
│   │   └── webhooks/
│   │       └── atlas/route.ts       # POST → Atlas webhook handler
│   ├── globals.css                  # Theme tokens & organic styles
│   ├── layout.tsx                   # Root layout with ThemeProvider
│   └── page.tsx                     # Main storefront page
├── components/
│   ├── builder/
│   │   ├── acai-builder.tsx         # 4-step builder Sheet
│   │   ├── builder-footer.tsx       # Price + Add to Cart
│   │   ├── step-size.tsx            # Step 1: Cup size
│   │   ├── step-creams.tsx          # Step 2: Creams/bases
│   │   ├── step-toppings.tsx        # Step 3: Dry toppings
│   │   └── step-sauces.tsx          # Step 4: Sauces/coberturas
│   ├── cart/
│   │   ├── cart-drawer.tsx          # Cart Sheet with checkout
│   │   └── cart-icon.tsx            # Header cart badge
│   ├── catalog/
│   │   ├── category-nav.tsx         # Horizontal category pills
│   │   ├── product-card.tsx         # Product card with image
│   │   └── product-grid.tsx         # Animated product grid
│   ├── layout/
│   │   ├── header.tsx               # Glassmorphism header
│   │   └── geofencing-modal.tsx     # CEP verification modal
│   └── ui/                          # shadcn/ui components
├── data/
│   └── mockData.ts                  # Fallback data (when Atlas is offline)
├── lib/
│   ├── atlas-api.ts                 # Atlas API service layer
│   ├── db.ts                        # Prisma client
│   └── utils.ts                     # cn() utility
├── store/
│   ├── builder-store.ts             # Zustand builder state
│   ├── cart-store.ts                # Zustand cart with hash IDs
│   └── location-store.ts           # Zustand geofencing state
└── types/
    └── index.ts                     # TypeScript interfaces
```

---

## 🔌 API Integration

### Atlas Core Banking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | Fetch all store products |
| `GET` | `/products/:slug` | Fetch single product |
| `POST` | `/checkout/session` | Create hosted checkout session |

### Headers

All API requests include:

```
X-Store-Slug: <NEXT_PUBLIC_STORE_SLUG>
X-Public-Key: <NEXT_PUBLIC_ATLAS_PUBLIC_KEY>
```

### Checkout Flow

1. Customer adds items to cart
2. Frontend calls `POST /api/checkout` with line items
3. Backend creates Atlas checkout session → returns `checkout_url`
4. Customer is redirected to Atlas hosted checkout (PCI-DSS compliant)
5. Atlas sends webhook to `POST /api/webhooks/atlas`
6. Customer is redirected to success page

### Webhook Events

| Event | Description |
|-------|-------------|
| `payment.confirmed` | Payment successful |
| `payment.failed` | Payment declined |
| `order.created` | New order created |
| `order.cancelled` | Order cancelled |

---

## 🛒 Cart System

The cart uses **composite hash IDs** to distinguish items with different configurations:

```
product_id + sorted_modifier_option_ids + quantities → deterministic hash
```

This allows the same product with different sizes/toppings to occupy separate cart lines.

---

## 🫐 Açaí Builder

4-step product configurator for custom açaí:

1. **Tamanho** — Single select (300ml / 500ml / 700ml)
2. **Cremes / Bases** — Multi-select, max 2 (Açaí Clássico, Banana, etc.)
3. **Toppings** — Counter-based, 3 free then +€0.50 each
4. **Coberturas** — Multi-select, max 2 (Mel, Chocolate, etc.)

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | App Router + Turbopack |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Styling |
| shadcn/ui | Component library |
| Zustand | Client state management |
| Framer Motion | Animations |
| next-themes | Light/dark mode |
| Atlas Core Banking | Headless payments (CaaS) |

---

## 📜 License

© 2024 Açaí da Terra. All rights reserved.
