# Task 6 — UI Developer: Açaí Builder Multi-Step Drawer

## Agent
UI Developer

## Task
Create the 6-component Açaí Builder system: multi-step Sheet panel with step navigation, per-step selection UI, and cart integration footer.

## Files Created

### 1. `/home/z/my-project/src/components/builder/acai-builder.tsx`
- Main builder component using shadcn `Sheet` (right-side panel)
- Controlled `open` state from `useBuilderStore.isOpen`
- `side="right"` with `sm:max-w-lg`, full width on mobile
- Header: step indicator (4 dots with labels, active one highlighted with acai glow), step counter
- Scrollable content area rendering the current step component
- Navigation: "Anterior" / "Seguinte" ghost buttons with progress bar dots
- "Seguinte" disabled when step 1 (size) not selected
- Clickable step dots for backward navigation

### 2. `/home/z/my-project/src/components/builder/step-size.tsx`
- Single-selection (radio-style) for size options from `getOptionsForGroup("mg-size")`
- Each option: selectable card with radio circle + check icon on selection
- Selected: acai-purple border + `glow-acai-sm`, scale animation via `framer-motion`
- Price delta shown on right in `font-mono` (e.g., "+1.50€")
- Calls `useBuilderStore.selectSize()` with `SelectedModifier`

### 3. `/home/z/my-project/src/components/builder/step-creams.tsx`
- Multi-select with max 2 for cream/base options from `getOptionsForGroup("mg-creams")`
- Toggleable chip/pill style with `rounded-full`
- Selected: acai-purple bg + glow, check icon
- When 2 selected: remaining unselected chips get `opacity-50 cursor-not-allowed`
- Counter badge "2/2" when max reached
- Calls `useBuilderStore.toggleCream()` with `maxAllowed=2`

### 4. `/home/z/my-project/src/components/builder/step-toppings.tsx`
- Counter-based selection for toppings from `getOptionsForGroup("mg-toppings")`
- Each row: name on left, counter (- [qty] +) on right
- "3 grátis" badge in neon-mint; extra units badge in neon-pink
- Counter buttons: rounded-full with acai-purple border
- After 3 free units total: shows "+0.50€ / unidade extra" in neon-pink
- Running display of free allowance remaining
- `freeAllowance=3`, `maxTotal=10`
- Calls `useBuilderStore.setToppingQuantity()`

### 5. `/home/z/my-project/src/components/builder/step-sauces.tsx`
- Same pattern as StepCreams but for sauces from `getOptionsForGroup("mg-sauces")`
- Multi-select with max 2, toggleable chips
- Shows price delta for sauces with extra cost
- Calls `useBuilderStore.toggleSauce()` with `maxAllowed=2`

### 6. `/home/z/my-project/src/components/builder/builder-footer.tsx`
- Fixed footer at bottom of Sheet
- Animated total price using `framer-motion AnimatePresence` + `text-acai text-glow-acai animate-pulse-glow`
- "Adicionar 1 Item ao Carrinho" button with `bg-neon-mint text-black glow-mint`
- Disabled if size not selected
- On click: assembles all `SelectedModifier[]`, calls `useCartStore.addItem()`, closes builder
- `glass-strong` background with `border-t border-acai/20`

## Design Decisions
- Used `Sheet` (right-side panel) per spec, not drawer
- All 6 files use `'use client'` directive
- Consistent use of acai-purple glow effects (`glow-acai-sm`, `text-glow-acai`)
- Neon-mint for CTAs, neon-pink for extra-cost indicators
- `framer-motion` for selection animations (scale, AnimatePresence for price)
- Cyberpunk glass-strong effect on the footer
- Scrollable content with `scrollbar-hide` utility

## Verification
- ESLint: No new errors introduced (only pre-existing error in geofencing-modal.tsx)
- Dev server: Compiles successfully with no errors
- All imports resolve correctly to existing stores, data, types, and UI components
