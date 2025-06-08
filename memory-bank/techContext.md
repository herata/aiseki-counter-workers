# Technical Context - 相席カウンター Stack

## Core Technologies

### Frontend Framework
- **Next.js 15.3.3**: Latest stable version with App Router
  - **App Router**: Modern routing system with layouts
  - **Server Components**: Where beneficial for performance
  - **Client Components**: For interactive UI elements
  - **Turbopack**: Development server with `--turbopack` flag

### UI & Styling
- **React 19**: Latest stable with concurrent features
- **Tailwind CSS 4**: Utility-first styling framework
- **Radix UI**: Accessible component primitives
  - `@radix-ui/react-popover`: Calendar dropdown
  - `@radix-ui/react-select`: Prefecture/store selectors
  - `@radix-ui/react-slot`: Flexible component composition

### Data & State Management
- **TanStack Query 5.80.6**: Server state management and caching
- **date-fns 4.1.0**: Date manipulation and formatting
- **React Day Picker 9.7.0**: Calendar component

### Visualization
- **Recharts 2.15.3**: Chart library for visitor data visualization
- **Lucide React 0.513.0**: Icon library for UI elements

### Development Tools
- **TypeScript 5**: Full type safety
- **Biome 1.9.4**: Fast linter and formatter
- **Wrangler 4.19.1**: Cloudflare development tools

## Development Setup

### Scripts
```json
{
  "dev": "next dev --turbopack",      // Development with Turbopack
  "build": "next build",              // Production build
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "cf-typegen": "wrangler types --env-interface CloudflareEnv ./cloudflare-env.d.ts",
  "fix": "biome check --write src"    // Auto-fix linting issues
}
```

### Development Workflow
1. **Local Development**: `npm run dev` with hot reloading via Turbopack
2. **Code Quality**: Biome for linting and formatting
3. **Type Safety**: TypeScript with strict configuration
4. **Preview**: Cloudflare preview before deployment

## Deployment Architecture

### Cloudflare Workers/Pages
- **OpenNext**: Adapter for Next.js on Cloudflare
- **Edge Runtime**: Global distribution for low latency
- **Serverless**: Pay-per-request pricing model
- **Environment**: Production environment configured via `wrangler.jsonc`

### Build Process
```
Next.js Build → OpenNext Transform → Cloudflare Workers/Pages
```

## Technical Constraints

### Performance Requirements
- **Bundle Size**: Minimize JavaScript payload
- **Loading Speed**: Sub-second initial page load
- **Responsiveness**: 60fps interactions and animations

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS 14+, Android 8+
- **JavaScript**: ES2020+ features available

### API Constraints
- **External API**: Visitor data fetched from external service
- **Rate Limiting**: Respectful request patterns
- **Error Handling**: Graceful degradation for API failures

## Configuration Files

### Key Configuration
- **`next.config.ts`**: Next.js configuration
- **`biome.json`**: Code quality and formatting rules
- **`tsconfig.json`**: TypeScript compiler configuration
- **`postcss.config.mjs`**: CSS processing pipeline
- **`components.json`**: shadcn/ui component configuration
- **`wrangler.jsonc`**: Cloudflare deployment configuration

### Environment Variables
- **Development**: Local environment via `.env.local`
- **Production**: Cloudflare environment variables
- **Type Safety**: `cloudflare-env.d.ts` for type definitions

## Dependencies Management

### Production Dependencies
- **Core**: React, Next.js, TypeScript
- **UI**: Tailwind, Radix UI, Lucide React
- **Data**: TanStack Query, date-fns
- **Charts**: Recharts for visualization

### Development Dependencies
- **Build**: Next.js, OpenNext for Cloudflare
- **Quality**: Biome, TypeScript
- **Tooling**: Wrangler, PostCSS

### Update Strategy
- **Security**: Automated security updates
- **Major Versions**: Quarterly review cycle
- **Testing**: Thorough testing before major updates

This technical stack provides excellent developer experience, performance, and scalability while maintaining modern web standards and best practices.
