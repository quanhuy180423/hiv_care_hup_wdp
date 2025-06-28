# Routing System Documentation

## Overview

This application uses a centralized routing system built on top of React Router. All routes are configured in `src/routes.ts` with type-safe definitions and centralized management.

## Route Configuration

Each route is defined with the following structure:

```typescript
interface RouteConfig {
  path: string; // URL pattern
  component: ComponentType; // React component to render
  title: string; // Page title for document.title
  description?: string; // Page description
  protected?: boolean; // Requires authentication
  layout?: "default" | "auth" | "minimal"; // Layout type
  icon?: LucideIcon; // Icon for navigation
  showInNav?: boolean; // Show in main navigation
}
```

## File Structure

```
src/
├── routes.ts              # Central route configuration
├── components/
│   ├── RouteGuard.tsx     # Authentication protection
│   └── Header.tsx         # Navigation component
├── hooks/
│   └── useDocumentTitle.ts # Document title management
├── pages/                 # Route components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── PricingPage.tsx
│   ├── ServicesPage.tsx
│   ├── KnowledgePage.tsx
│   ├── ContactPage.tsx
│   ├── LoginPage.tsx
│   ├── UsersPage.tsx
│   ├── CounterPage.tsx
│   └── NotFoundPage.tsx
└── App.tsx               # Route rendering
```

## Available Routes

### Public Routes

- `/` - HomePage (Trang chủ)
- `/about` - AboutPage (Giới thiệu)
- `/pricing` - PricingPage (Bảng giá)
- `/services` - ServicesPage (Dịch vụ)
- `/knowledge` - KnowledgePage (Kiến thức)
- `/contact` - ContactPage (Liên hệ)
- `/login` - LoginPage (Đăng nhập)
- `/counter` - CounterPage (Counter Demo)

### Protected Routes

- `/users` - UsersPage (Người dùng) - Requires authentication

### Error Routes

- `*` - NotFoundPage (404 Not Found)

## Navigation System

The navigation menu in `Header.tsx` automatically uses the route configuration:

```typescript
const navItems = navigationRoutes.map((route) => ({
  path: route.path,
  label: route.title,
  icon: route.icon!,
}));
```

Routes are filtered based on the `showInNav` property.

## Protected Routes

Protected routes are wrapped with `RouteGuard` component that checks authentication:

```typescript
<RouteGuard isProtected={route.protected}>
  <Component />
</RouteGuard>
```

Unauthenticated users are redirected to the login page with return URL.

## Document Title Management

The `useDocumentTitle` hook automatically updates the browser tab title based on the current route:

```typescript
// Updates to: "Trang chủ - HIV Care Hub"
document.title = `${route.title} - HIV Care Hub`;
```

## Adding New Routes

1. Create the page component in `src/pages/`
2. Export it from `src/pages/index.ts`
3. Add route configuration to `src/routes.ts`:

```typescript
{
  path: "/new-page",
  component: NewPageComponent,
  title: "New Page",
  description: "Description of new page",
  layout: "default",
  icon: IconComponent,
  showInNav: true
}
```

4. The route will automatically appear in navigation if `showInNav: true`

## Type Safety

The routing system provides several type-safe utilities:

```typescript
// Route path constants
import { ROUTES } from "@/routes";
navigate(ROUTES.HOME); // Type-safe navigation

// Route configuration access
import { getRouteConfig, isProtectedRoute } from "@/routes";
const config = getRouteConfig("/about");
const protected = isProtectedRoute("/users");
```

## Layout System

Routes can specify different layouts:

- `default` - Full layout with Header + Footer
- `auth` - Authentication-focused layout
- `minimal` - Minimal layout for error pages

Currently all routes use default layout, but the system is extensible.

## Authentication Integration

The route system is designed to integrate with any authentication solution:

1. Update `RouteGuard` component with your auth logic
2. Set `protected: true` for routes requiring authentication
3. Authentication state can be managed via Zustand, Context, or external service

## Best Practices

1. Keep route configurations in `src/routes.ts`
2. Use type-safe route constants from `ROUTES`
3. Set appropriate `showInNav` values for navigation
4. Use descriptive titles and descriptions for SEO
5. Test protected routes with different auth states
6. Keep route components in `src/pages/` directory
