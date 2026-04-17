# System Patterns: Form Builder Architecture

## Core Architecture
```
App
├── FormBuilder (Main Container)
│   ├── ElementLibrary (Draggable Elements)
│   ├── FormCanvas (Drop Zone)
│   ├── PropertyPanel (Element Configuration)
│   └── PreviewMode (Form Preview)
├── Zustand Store (State Management)
└── JSON Export (Schema Generation)
```

## State Management Pattern
- **Zustand Store**: Centralized state for form schema, selected element, preview mode
- **Form Schema**: Array of form elements with properties and validation rules
- **Selected Element**: Currently active element for property editing
- **Preview Mode**: Toggle between builder and preview states

## Drag-and-Drop Pattern
- **dnd-kit Implementation**: Modern drag-and-drop with TypeScript support
- **Element Library**: Draggable form element components
- **Canvas Drop Zone**: Accepts dropped elements and handles reordering
- **Reordering**: Within-canvas drag-and-drop for element reordering

## Component Patterns
- **Atomic Design**: Small, reusable form element components
- **Compound Components**: Complex elements like select with options
- **Render Props**: For flexible element rendering in preview mode
- **Higher-Order Components**: For drag-and-drop wrapper functionality

## Data Flow
1. **Drag Start**: Element dragged from library
2. **Drop**: Element added to form schema
3. **Selection**: Element selected for property editing
4. **Property Update**: Schema updated with new properties
5. **Preview**: Real-time form rendering
6. **Export**: JSON schema generation and download

## Key Technical Decisions
- **TypeScript**: Full type safety for form schemas and components
- **CSS Modules**: Component-scoped styling for maintainability
- **Zustand**: Lightweight state management with TypeScript support
- **dnd-kit**: Modern drag-and-drop library with better accessibility

