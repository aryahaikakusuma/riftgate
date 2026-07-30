# RIFTGATE — Project Documentation

## Overview

**RIFTGATE** is a marketplace and database platform for **Riftbound TCG** (Trading Card Game). It serves as a one-stop destination for TCG collectors and competitive players, offering price tracking, marketplace integration, deck building tools, and collection management features.

### Key Features
- **Marketplace & Price Radar**: Track card prices over 60 days with price alerts and value estimation
- **Deck Builder**: Create and manage decks from your collection, export to tournament formats
- **Collection Tracker**: Organize cards by set, track completion progress, and export data as CSV
- **Card Database**: Browse all sets (Origins, Spiritforged, Arcane, Vendetta) with detailed card information
- **Search & Filter**: Powerful search with filtering capabilities for finding specific cards

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.18 (React 18.3.1)
- **Styling**: TailwindCSS 3.4.1 with custom theming
- **UI Components**: Radix UI (accessible, headless components)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: SWR + Axios
- **State Management**: React Query (@tanstack/react-query) for server state
- **Animations**: Framer Motion
- **Charts/Visualizations**: Recharts
- **Date Handling**: Day.js, date-fns, React Day Picker
- **Toast Notifications**: Sonner
- **Icons**: Lucide React

### Backend
- **Database**: MongoDB 6.6.0
- **API**: Next.js API routes with catch-all routing

### Development
- **Package Manager**: Yarn 1.22.22
- **Build Tool**: Next.js (built-in webpack)
- **Linting**: ESLint via globals

---

## Project Structure

```
riftgate/
├── app/                          # Next.js App Router directory
│   ├── layout.js                 # Root layout with metadata
│   ├── page.js                   # Home page
│   ├── providers.js              # React Query provider
│   ├── globals.css               # Global styles & theme
│   ├── cards/
│   │   └── [cardId]/page.js      # Individual card detail page
│   ├── search/page.js            # Search & filter cards
│   ├── sets/page.js              # All sets view
│   ├── sets/[setId]/page.js      # Individual set detail
│   ├── collect/page.js           # Collection tracker
│   ├── deck-builder/page.js      # Deck building tool
│   └── api/
│       └── [[...path]]/route.js  # Catch-all API route
├── components/                   # React components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CardThumbnail.jsx
│   ├── CardGrid.jsx
│   ├── CardArt.jsx
│   ├── HeroCarousel.jsx
│   ├── FilterSidebar.jsx
│   ├── PriceChart.jsx
│   ├── RulesText.jsx
│   ├── SetBanner.jsx
│   └── ui/                       # Radix UI wrapped components
│       ├── accordion.jsx
│       ├── alert.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       ├── form.jsx
│       ├── input.jsx
│       ├── select.jsx
│       ├── tabs.jsx
│       └── [other UI components]
├── lib/                          # Utilities and helpers
│   └── mock/data.js              # Mock card & set data
├── public/                       # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

---

## Routes & Pages

### Public Routes

| Route | Purpose | Component |
|-------|---------|-----------|
| `/` | Landing page with hero carousel, deals, trending cards, sets | `app/page.js` |
| `/search` | Search, filter, and browse all cards | `app/search/page.js` |
| `/cards/[cardId]` | Individual card detail: price history, rules, availability | `app/cards/[cardId]/page.js` |
| `/sets` | View all Riftbound TCG sets | `app/sets/page.js` |
| `/sets/[setId]` | Individual set: cards in set, set details, release info | `app/sets/[setId]/page.js` |
| `/collect` | Collection tracker: organize cards, progress by set | `app/collect/page.js` |
| `/deck-builder` | Deck builder: select legend, add 40 cards, export | `app/deck-builder/page.js` |

### API Routes

| Route | Purpose |
|-------|---------|
| `/api/[[...path]]` | Catch-all API route for all backend endpoints (MongoDB operations) |

---

## Styling & Design System

### Theme
- **Mode**: Dark mode by default (set in `layout.js` with `className="dark"`)
- **Approach**: CSS custom properties (HSL) with Tailwind extensions

### Color Palette

| Element | Value | Usage |
|---------|-------|-------|
| Primary (Rift Orange) | `#FF6B00` (22° 100% 50%) | Accents, highlights, CTAs, glows |
| Background | `#0A0A0A` (0° 0% 4%) | Main background |
| Card Background | `#121212` (0° 0% 7%) | Card panels, elevated surfaces |
| Card Highlight | `#1A1A1A` (0° 0% 12%) | Higher elevation cards (`bg-panel-hi`) |
| Text Primary | `#FAFAFA` (0° 0% 98%) | Main text color |
| Text Secondary | `#A1A1A1` (0° 0% 63%) | Muted text, secondary info |
| Border | `#262626` (0° 0% 15%) | Borders, dividers |
| Destructive | `#FF4646` (0° 84% 60%) | Errors, dangerous actions |

### Custom Utilities

#### Rift Color Utilities
```css
.text-rift       /* color: #FF6B00 */
.bg-rift         /* background-color: #FF6B00 */
.border-rift     /* border-color: #FF6B00 */
```

#### Gradient & Glow
```css
.bg-gradient-rift      /* linear-gradient(135deg, #FF6B00 0%, #FF3D00 100%) */
.glow-orange           /* Box shadow with orange glow: 0 0 20px rgba(255, 107, 0, 0.35), ... */
.text-glow-orange      /* Text shadow with orange glow */
```

#### Interactions
```css
.card-hover            /* Smooth 0.2s ease transform & box-shadow on hover */
                       /* Hover: translateY(-4px) + orange shadow */
.no-scrollbar          /* Hide scrollbars (webkit & firefox) */
```

#### Backgrounds
```css
.bg-panel              /* #121212 - standard card background */
.bg-panel-hi           /* #1A1A1A - higher elevation */
```

### Font Stack
```
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Border Radius
- Large: `0.5rem` (standard)
- Medium: `calc(0.5rem - 2px)`
- Small: `calc(0.5rem - 4px)`

### Spacing
- Uses Tailwind defaults (4px baseline)
- Container max-width: `1400px` for `2xl` breakpoint

### Typography
- **Font smoothing**: Enabled for smooth rendering
- **Selection**: Orange primary on white text

---

## Component Architecture

### Layout Components
- **Navbar**: Navigation with links to main sections
- **Footer**: Footer with links and branding
- **Layout**: Root layout with Providers (React Query)

### Feature Components
- **HeroCarousel**: Animated carousel for featured content (uses embla-carousel)
- **CardThumbnail**: Card display in grid/list view
- **CardGrid**: Grid layout for card collections
- **CardArt**: Card artwork display with proper aspect ratio
- **SetBanner**: Set cover art and metadata
- **PriceChart**: Price history visualization (Recharts)
- **RulesText**: Formatted card rules/text display
- **FilterSidebar**: Advanced filtering for search

### UI Components (Radix UI Wrappers)
Located in `components/ui/` — all Radix UI primitives wrapped with Tailwind styling:
- Form controls: Button, Input, Select, Checkbox, Radio, Toggle, Switch
- Content: Card, Dialog, Drawer, Alert, Toast (Sonner)
- Navigation: Tabs, Breadcrumb, Navigation Menu
- Display: Accordion, Collapsible, Hover Card, Popover
- Complex: Command (cmd), Data tables via React Table

---

## Data Flow

### Client-Side State
- **Server State** (queries): React Query with 60s stale time, no refetch on window focus
- **Form State**: React Hook Form with Zod validation
- **Local State**: React hooks for component-level UI state

### Server Communication
- **HTTP Client**: Axios
- **Request Pattern**: `/api/[[...path]]` catch-all routes MongoDB queries
- **Response Format**: JSON

### Mock Data
- Temporary mock data in `lib/mock/data.js` (CARDS, SETS)
- Used for development before MongoDB integration

---

## Key Development Patterns

### Naming Conventions
- **Components**: PascalCase (e.g., `CardThumbnail.jsx`)
- **Pages**: Lowercase, kebab-case in route folders (e.g., `/deck-builder`)
- **CSS Classes**: Lowercase, kebab-case (Tailwind convention)
- **Files**: Lowercase for utilities/libraries, PascalCase for components

### Code Style
- Use `'use client'` for client-side components (App Router)
- Prefer functional components with hooks
- Use destructuring for props
- Keep components focused and single-responsibility

### Performance
- Image optimization via Next.js `Image` component
- No scrollbar on horizontal card lists (`.no-scrollbar`)
- Lazy loading on routes via Next.js code splitting
- React Query stale time: 60 seconds (prevents excessive refetches)

### Accessibility
- All UI components built on Radix UI (ARIA-compliant)
- Semantic HTML (buttons, links, forms)
- Color contrast meets WCAG standards
- Icon + text labels for interactive elements

---

## Common Tasks

### Adding a New Page
1. Create folder in `app/` with route name
2. Create `page.js` with `'use client'` directive
3. Import components and layout (Navbar, Footer)
4. Use Tailwind for styling
5. Link from Navbar or other pages

### Adding a New Component
1. Create `YourComponent.jsx` in `components/`
2. Use `'use client'` if it has interactivity
3. Import icons from `lucide-react`
4. Use Tailwind utilities and custom classes (`.text-rift`, `.card-hover`, etc.)
5. Keep component focused on a single responsibility

### Creating a Form
1. Use `react-hook-form` for state management
2. Use `zod` for validation schema
3. Wrap form in `Providers` for query context
4. Use Radix UI components from `components/ui/`
5. Display errors with Sonner toasts or form-level validation

### Styling New Elements
- Use Tailwind utilities first (spacing, sizing, positioning)
- Use custom `.text-rift`, `.bg-gradient-rift` for Riftbound branding
- Use `.card-hover` for interactive card elements
- Leverage CSS variables for theme colors: `var(--primary)`, `var(--background)`, etc.

---

## Browser Support
- Modern browsers only (ES2020+)
- No IE11 support
- Mobile-first responsive design with Tailwind breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1400px

---

## Environment & Configuration

### Development
```bash
yarn dev              # Run with max heap size (512MB)
yarn dev:no-reload   # Run without fast refresh (webpack issue)
```

### Production
```bash
yarn build  # Build for production
yarn start  # Start production server
```

### Default Port: `3000`
- Accessible on `0.0.0.0:3000` (network accessible)

### PostCSS
- Autoprefixer for vendor prefixes
- Tailwind CSS processing

---

## Dependencies to Know

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.5.18 | React framework & SSR |
| `react` | 18.3.1 | UI library |
| `tailwindcss` | 3.4.1 | Utility-first CSS |
| `@radix-ui/*` | 1.x | Headless UI primitives |
| `@tanstack/react-query` | 5.56.2 | Server state management |
| `react-hook-form` | 7.58.1 | Form state & validation |
| `zod` | 3.25.67 | Schema validation |
| `recharts` | 2.15.3 | Chart library |
| `framer-motion` | 11.18.0 | Animation library |
| `mongodb` | 6.6.0 | Database driver |
| `axios` | 1.18.0 | HTTP client |
| `lucide-react` | 0.516.0 | Icon library |
| `sonner` | 2.0.5 | Toast notifications |

---

## Notes for Developers

1. **Dark Mode Only**: The app is styled for dark mode exclusively. Do not implement light mode without updating the color palette and all components.

2. **Orange Branding**: The Rift orange (`#FF6B00`) is the primary accent. Use sparingly for CTAs, links, and highlights to maintain visual hierarchy.

3. **Card Hover Effects**: All interactive cards should use `.card-hover` class for consistent hover animation (lift + orange glow).

4. **Language**: UI is in Indonesian (Bahasa Indonesia). Ensure translations or localization keys are used for all user-facing text.

5. **API Route Catch-All**: All backend endpoints go through `/api/[[...path]]`. No hardcoded API URLs in components.

6. **Responsive Images**: Use `CardArt`, `CardThumbnail`, or Next.js `Image` for optimized images. Define aspect ratios to prevent layout shift.

7. **Error Handling**: Use Sonner toasts for user feedback. Always catch and display API errors gracefully.

8. **Performance**: Monitor bundle size and use dynamic imports for large components if needed (`React.lazy` with Suspense).
