# OSU.OSEF.ME Frontend Documentation

Welcome to the OSU.OSEF.ME frontend documentation. This project follows atomic design principles and modern React patterns for maintainable and scalable code.

## 📚 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Components](#components)
  - [Atoms](./atoms/README.md) - Basic building blocks
  - [Molecules](./molecules/README.md) - Simple combinations of atoms
  - [Organisms](./organisms/README.md) - Complex UI components
- [Hooks](./hooks/README.md) - Custom React hooks
  - [Atomic Hooks](./hooks/atoms/README.md) - Low-level hooks
  - [Molecular Hooks](./hooks/molecules/README.md) - High-level hooks
- [Types](#types) - TypeScript definitions
- [Utils](#utils) - Utility functions
- [Services](#services) - API and external services
- [Development Guidelines](#development-guidelines)

## 🏗️ Architecture Overview

This project follows the **Atomic Design** methodology with a clear separation of concerns:

```
src/
├── components/
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Simple combinations of atoms
│   └── organisms/      # Complex UI components
├── hooks/
│   ├── atoms/          # Atomic-level hooks
│   └── molecules/      # Molecular-level hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── services/           # API and external services
```

## 🧩 Components

### Atoms
Basic building blocks that cannot be broken down further. See [Atoms Documentation](./atoms/README.md) for complete details.

| Component | Description | Props | Usage |
|-----------|-------------|-------|-------|
| [Badge](./atoms/Badge.md) | Colored badge with optional outline | `color`, `outline`, `title` | Status indicators, labels |
| [Button](./atoms/Button.md) | Interactive button component | `variant`, `size`, `onClick` | Actions, navigation |
| [Image](./atoms/Image.md) | Optimized image component | `src`, `alt`, `className` | Covers, avatars |
| [Input](./atoms/Input.md) | Form input field | `type`, `placeholder`, `value` | Forms, search |
| [Select](./atoms/Select.md) | Dropdown selection | `options`, `value`, `onChange` | Filters, choices |
| [Tooltip](./atoms/Tooltip.md) | Hover information | `content`, `position` | Help text, details |
| [PatternBadge](./atoms/PatternBadge.md) | Game pattern indicator | `pattern` | Beatmap patterns |
| [DifficultyBadge](./atoms/DifficultyBadge.md) | Difficulty rating | `rating`, `difficulty` | Beatmap difficulties |
| [StatusBadge](./atoms/StatusBadge.md) | Beatmap status | `status` | Ranked, loved, etc. |
| [DifficultyRange](./atoms/DifficultyRange.md) | Difficulty range display | `minRating`, `maxRating` | Beatmap ranges |

### Molecules
Simple combinations of atoms that form functional UI components. See [Molecules Documentation](./molecules/README.md) for complete details.

| Component | Description | Props | Usage |
|-----------|-------------|-------|-------|
| [BeatmapGrid](./molecules/BeatmapGrid.md) | Grid layout for beatmaps | `beatmaps`, `columns` | Beatmap listings |
| [BeatmapHeader](./molecules/BeatmapHeader.md) | Beatmap information header | `beatmapset` | Beatmap details |
| [BeatmapPreview](./molecules/BeatmapPreview.md) | Beatmap preview component | `beatmap` | Quick previews |
| [DifficultyButtons](./molecules/DifficultyButtons.md) | Difficulty selection | `difficulties`, `onSelect` | Difficulty picker |
| [FilterSection](./molecules/FilterSection.md) | Filter controls | `filters`, `onChange` | Search filters |
| [MSDRadarChart](./molecules/MSDRadarChart.md) | MSD radar visualization | `data` | Skill analysis |
| [RateSelector](./molecules/RateSelector.md) | Play rate selection | `rates`, `selected` | Rate picker |
| [BeatmapHorizontalCard](./molecules/BeatmapHorizontalCard.md) | Horizontal beatmap card | `beatmapset` | Beatmap cards |

### Organisms
Complex UI components that combine molecules and atoms. See [Organisms Documentation](./organisms/README.md) for complete details.

| Component | Description | Props | Usage |
|-----------|-------------|-------|-------|
| [BeatmapList](./organisms/BeatmapList.md) | Complete beatmap listing | `beatmaps`, `filters` | Main beatmap view |
| [BeatmapMSDView](./organisms/BeatmapMSDView.md) | MSD analysis view | `beatmap` | Skill analysis |
| [Navbar](./organisms/Navbar.md) | Main navigation | - | Site navigation |
| [RandomBeatmapList](./organisms/RandomBeatmapList.md) | Random beatmap generator | `count` | Random selection |
| [ThemeManager](./organisms/ThemeManager.md) | Theme management | - | Dark/light mode |

## 🪝 Hooks

### Atomic Hooks
Low-level hooks that handle specific data or state. See [Atomic Hooks Documentation](./hooks/atoms/README.md) for complete details.

| Hook | Description | Parameters | Returns |
|------|-------------|------------|---------|
| [useBeatmapPatterns](./hooks/atoms/useBeatmapPatterns.md) | Extract beatmap patterns | `beatmaps`, `maxPatterns` | `string[]` |
| [useBeatmapStatus](./hooks/atoms/useBeatmapStatus.md) | Get beatmap priority status | `beatmaps` | `BeatmapStatus` |
| [useSortedBeatmaps](./hooks/atoms/useSortedBeatmaps.md) | Sort beatmaps by difficulty | `beatmaps` | `BeatmapCompleteShort[]` |
| [useDisplayedBeatmaps](./hooks/atoms/useDisplayedBeatmaps.md) | Limit displayed beatmaps | `beatmaps`, `maxDisplayed` | `{displayedMaps, remainingCount}` |
| [useDifficultyRange](./hooks/atoms/useDifficultyRange.md) | Calculate difficulty range | `beatmaps` | `{minRating, maxRating}` |

### Molecular Hooks
Higher-level hooks that combine atomic hooks and handle complex logic. See [Molecular Hooks Documentation](./hooks/molecules/README.md) for complete details.

| Hook | Description | Parameters | Returns |
|------|-------------|------------|---------|
| [useBeatmapCardActions](./hooks/molecules/useBeatmapCardActions.md) | Handle card interactions | `beatmapset`, `sortedMaps` | `{handleClick, handleDownload}` |
| [useBeatmapHorizontalCard](./hooks/molecules/useBeatmapHorizontalCard.md) | Complete card logic | `beatmapset` | All card data and actions |

## 📝 Types

TypeScript type definitions for the application.

### Beatmap Types
- [BeatmapShort](./types/beatmap/short.md) - Basic beatmap information
- [BeatmapExtended](./types/beatmap/extended.md) - Extended beatmap data
- [BeatmapStatus](./types/beatmap/status.md) - Beatmap status definitions
- [BeatmapMSD](./types/beatmap/msd.md) - MSD (Mania Skill Difficulty) data

### Component Types
- [BadgeProps](./types/atoms/Badge.md) - Badge component props
- [ButtonProps](./types/atoms/Button.md) - Button component props
- [InputProps](./types/atoms/Input.md) - Input component props

## 🛠️ Utils

Utility functions for common operations.

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| [getRatingColor](./utils/getRatingColor.md) | Get color for difficulty rating | `rating: number` | `ColorName` |
| [mapParser](./utils/map_parser.md) | Parse beatmap data | `data: any` | `ParsedBeatmap` |
| [errorHandler](./utils/errorHandler.md) | Handle application errors | `error: Error` | `void` |
| [logger](./utils/logger.md) | Application logging | `message: string` | `void` |

## 🌐 Services

API and external service integrations.

| Service | Description | Methods |
|---------|-------------|---------|
| [API Client](./services/api/client.md) | Base API client | `get`, `post`, `put`, `delete` |
| [Osu API](./services/api/fetch_osu.md) | OSU! API integration | `getBeatmap`, `getBeatmapset` |
| [Beatmap Services](./services/api/index.md) | Beatmap-specific services | Various beatmap operations |

## 📋 Development Guidelines

### Component Creation
1. Follow atomic design principles
2. Use TypeScript for all components
3. Create corresponding documentation
4. Add proper prop types
5. Include usage examples

### Hook Creation
1. Use descriptive names
2. Follow React hooks rules
3. Add proper TypeScript types
4. Include JSDoc comments
5. Test with different scenarios

### File Organization
```
component-name/
├── ComponentName.tsx
├── ComponentName.module.css (if needed)
├── index.ts
└── README.md
```

### Naming Conventions
- **Components**: PascalCase (`BeatmapCard`)
- **Hooks**: camelCase starting with `use` (`useBeatmapData`)
- **Types**: PascalCase with descriptive suffix (`BeatmapProps`)
- **Files**: PascalCase for components, camelCase for utilities

## 🚀 Getting Started

1. **Install dependencies**: `pnpm install`
2. **Start development**: `pnpm dev`
3. **Run tests**: `pnpm test`
4. **Build**: `pnpm build`

## 📖 Contributing

1. Follow the established patterns
2. Update documentation for new components
3. Add tests for new functionality
4. Ensure TypeScript compliance
5. Follow the code style guidelines

---

For more detailed information about specific components or hooks, please refer to their individual documentation files.
