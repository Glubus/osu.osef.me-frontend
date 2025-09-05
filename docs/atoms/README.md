# Atoms Documentation

Atoms are the basic building blocks of our UI. They cannot be broken down further and represent the smallest functional components.

## 📋 Available Atoms

### Core Atoms
- [Badge](./Badge.md) - Colored badge with optional outline
- [Button](./Button.md) - Interactive button component
- [Image](./Image.md) - Optimized image component
- [Input](./Input.md) - Form input field
- [Select](./Select.md) - Dropdown selection
- [Tooltip](./Tooltip.md) - Hover information display

### Beatmap-Specific Atoms
- [PatternBadge](./PatternBadge.md) - Game pattern indicator
- [DifficultyBadge](./DifficultyBadge.md) - Difficulty rating display
- [StatusBadge](./StatusBadge.md) - Beatmap status indicator
- [DifficultyRange](./DifficultyRange.md) - Difficulty range display

### Chart Atoms
- [ChartsToolTip](./ChartsToolTip.md) - Chart tooltip component

### Theme Atoms
- [ThemeSwitcher](./ThemeSwitcher.md) - Theme toggle component

## 🎯 Design Principles

### Atomic Design
Atoms follow the atomic design methodology:
- **Single Responsibility**: Each atom has one clear purpose
- **Reusability**: Can be used across different contexts
- **Consistency**: Follow established design patterns
- **Composability**: Can be combined to create larger components

### Props Interface
All atoms follow a consistent props interface:
```typescript
interface AtomProps {
  children?: React.ReactNode;
  className?: string;
  // ... specific props
}
```

### Styling
- Use CSS modules for component-specific styles
- Follow DaisyUI design system
- Support theme switching (dark/light mode)
- Ensure accessibility compliance

## 🚀 Usage Guidelines

### Import Pattern
```typescript
import { Badge, Button, Input } from '@/components/atoms';
```

### Component Creation
When creating new atoms:
1. Follow the established naming convention
2. Include proper TypeScript types
3. Add comprehensive documentation
4. Include usage examples
5. Ensure accessibility compliance

### Testing
Each atom should have:
- Unit tests for basic functionality
- Visual regression tests
- Accessibility tests
- Cross-browser compatibility tests

## 📊 Component Matrix

| Component | Props | Events | Styling | Accessibility |
|-----------|-------|--------|---------|---------------|
| Badge | ✅ | ❌ | ✅ | ✅ |
| Button | ✅ | ✅ | ✅ | ✅ |
| Image | ✅ | ❌ | ✅ | ✅ |
| Input | ✅ | ✅ | ✅ | ✅ |
| Select | ✅ | ✅ | ✅ | ✅ |
| Tooltip | ✅ | ❌ | ✅ | ✅ |
| PatternBadge | ✅ | ❌ | ✅ | ✅ |
| DifficultyBadge | ✅ | ❌ | ✅ | ✅ |
| StatusBadge | ✅ | ❌ | ✅ | ✅ |
| DifficultyRange | ✅ | ❌ | ✅ | ✅ |
| ChartsToolTip | ✅ | ❌ | ✅ | ✅ |
| ThemeSwitcher | ✅ | ✅ | ✅ | ✅ |

## 🔧 Development

### File Structure
```
atoms/
├── ComponentName/
│   ├── ComponentName.tsx
│   ├── ComponentName.module.css (optional)
│   └── index.ts
├── index.ts
└── README.md
```

### Naming Conventions
- **Component files**: PascalCase (`Badge.tsx`)
- **Props types**: PascalCase with `Props` suffix (`BadgeProps`)
- **CSS classes**: camelCase (`badgeContainer`)
- **Exports**: PascalCase for components, camelCase for utilities

### TypeScript
- Use strict typing for all props
- Export prop types for external use
- Include JSDoc comments for complex props
- Use generic types when appropriate

## 📚 Related Documentation

- [Molecules Documentation](../molecules/README.md)
- [Organisms Documentation](../organisms/README.md)
- [Hooks Documentation](../hooks/README.md)
- [Design System Guide](../design-system.md)
