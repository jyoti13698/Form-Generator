# Technical Context: Form Builder Stack

## Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Zustand**: Lightweight state management library
- **dnd-kit**: Modern drag-and-drop library with TypeScript support

## Development Dependencies
```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

## Runtime Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^7.0.0",
    "@dnd-kit/utilities": "^3.2.0"
  }
}
```

## Development Setup
- **Node.js**: Version 18+ required
- **Package Manager**: npm or yarn
- **IDE**: VS Code with TypeScript and React extensions
- **Browser**: Modern browsers with ES6+ support

## Build Configuration
- **Vite Config**: React plugin with TypeScript support
- **TypeScript Config**: Strict mode with React JSX
- **CSS**: CSS Modules for component-scoped styling
- **Assets**: Static assets in public directory

## Development Workflow
1. **Development Server**: `npm run dev` for hot reload
2. **Type Checking**: `npm run type-check` for TypeScript validation
3. **Build**: `npm run build` for production build
4. **Preview**: `npm run preview` for production preview

## Code Quality
- **ESLint**: React and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Component Testing**: React Testing Library (future)

