# 相席カウンター (Aiseki Counter) Dashboard

A modern, responsive dashboard for Japanese matchmaking restaurant analytics built with Next.js 15, React 19, and TypeScript.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎯 Overview

相席カウンター (Aiseki Counter) is a specialized business analytics dashboard designed for Japanese matchmaking restaurants. It provides real-time visitor flow visualization with gender breakdown, historical comparisons, and multi-location management capabilities.

### Key Features

- **📊 Real-time Analytics**: Live visitor counts with male/female breakdown
- **📈 Trend Analysis**: Week-over-week comparison with visual indicators
- **🏪 Multi-location Support**: Prefecture and store selection across Japan
- **📱 Mobile-first Design**: Responsive layout optimized for all devices
- **⚡ Smart Defaults**: Time-based date selection (before 6PM = yesterday, after 6PM = today)
- **🎨 Modern UI**: Clean, minimalist interface with consistent styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Development

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deployment (Cloudflare)

```bash
# Deploy to Cloudflare Workers/Pages
npm run deploy

# Preview deployment
npm run preview
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Radix UI components
- **State Management**: TanStack Query, React hooks
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns with Japanese locale
- **Deployment**: Cloudflare Workers/Pages via OpenNext
- **Development**: Biome for linting/formatting, Turbopack for dev server

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Main dashboard component
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   ├── PrefectureSelect.tsx
│   ├── ShopSelect.tsx
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── provider/          # Context providers
```

### Key Components

- **Dashboard** (`page.tsx`): Main analytics interface with charts and controls
- **PrefectureSelect**: Dropdown for Japanese prefecture selection
- **ShopSelect**: Dynamic store selection based on prefecture
- **Charts**: Recharts-based visualization with male/female visitor trends

## 🎨 Design System

### Core Principles

- **Mobile-first**: Responsive design starting from mobile devices
- **Minimalism**: Clean UI without unnecessary elements
- **Consistency**: Unified styling across all components
- **Performance**: Fixed heights to prevent layout shifts

### Color Scheme

- **Male visitors**: Blue (#2563eb)
- **Female visitors**: Red (#dc2626)
- **Previous week data**: Dashed lines in same colors
- **UI**: Tailwind CSS design tokens

## 📱 Features in Detail

### Smart Date Selection
- **Business Logic**: Automatically selects relevant date based on current time
- **Before 6PM**: Defaults to yesterday (end-of-day analysis)
- **After 6PM**: Defaults to today (real-time monitoring)
- **Future Restriction**: Prevents selection of future dates

### Calendar Auto-close
- **Mobile UX**: Calendar automatically closes after date selection
- **Reduced Friction**: Minimizes taps required for mobile users
- **State Management**: Explicit calendar visibility control

### Responsive Layout
- **Horizontal Preservation**: Prefecture/store selectors stay side-by-side on mobile
- **Flexible Sizing**: Adaptive text and component sizing
- **Touch-friendly**: Optimized for mobile interaction

### Error Handling
- **Graceful Degradation**: Always shows useful content
- **Clear Messaging**: Explains what went wrong and next steps
- **Retry Mechanisms**: Easy recovery with reload buttons
- **Loading States**: Smooth loading indicators

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run deploy` | Deploy to Cloudflare |
| `npm run preview` | Preview Cloudflare deployment |
| `npm run lint` | Run Next.js linter |
| `npm run fix` | Auto-fix code formatting with Biome |
| `npm run cf-typegen` | Generate Cloudflare environment types |

## 📚 Documentation

Additional project documentation is available in the `memory-bank/` directory:

- **`projectbrief.md`**: Project scope and requirements
- **`productContext.md`**: Business context and user experience goals
- **`systemPatterns.md`**: Architecture patterns and technical decisions
- **`techContext.md`**: Technology stack and development setup
- **`activeContext.md`**: Current work status and recent changes
- **`progress.md`**: Implementation status and production readiness

## 🤝 Development Guidelines

### Code Quality
- **TypeScript**: Strict type checking enabled
- **Biome**: Automated linting and formatting
- **Component Patterns**: Composition over inheritance
- **Performance**: Memoization for expensive operations

### Business Context
- **Japanese Locale**: Date formatting and UI text in Japanese
- **Restaurant Operations**: Understanding of matchmaking restaurant business model
- **Time-based Logic**: Respect for business hours and operational patterns

## 📄 License

This project is private and proprietary.

---

**Status**: ✅ Production Ready | **Version**: 0.1.0 | **Last Updated**: June 2025
