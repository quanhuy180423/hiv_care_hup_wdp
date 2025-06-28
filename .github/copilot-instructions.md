<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Modern React App - Copilot Instructions

## Project Overview

This is a modern React application built with the following tech stack:

- **Vite** - Fast build tool and dev server
- **React 18** with **TypeScript** - Type-safe component development
- **Zustand** - Lightweight state management
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful, accessible component library
- **Lucide React** - Icon library

## Code Style Guidelines

### TypeScript

- Always use strict type checking
- Avoid `any` and `unknown` types
- Use proper type imports with `type` keyword when importing types only
- Leverage Zod schemas for runtime validation and type inference

### Components

- Use functional components with React hooks
- Prefer arrow functions for component definition
- Use proper TypeScript interfaces for props
- Components should be placed in `src/components/` directory
- Use Shadcn UI components whenever possible

### State Management

- Use Zustand for global state management
- Store files should be in `src/store/` directory
- Use React Hook Form for form state management
- Leverage React Query for server state

### Styling

- Use Tailwind CSS utility classes
- Follow Shadcn UI design system patterns
- Use CSS variables for theming (already configured)
- Responsive design with mobile-first approach

### File Structure

```
src/
├── components/        # React components
│   ├── ui/           # Shadcn UI components
│   └── forms/        # Form components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── schemas/          # Zod validation schemas
├── store/            # Zustand stores
└── types/            # TypeScript type definitions
```

### Best Practices

- Always validate form inputs with Zod schemas
- Use React Query for data fetching with proper error handling
- Implement loading states and error boundaries
- Follow accessibility best practices
- Use semantic HTML elements
- Implement proper error handling patterns
