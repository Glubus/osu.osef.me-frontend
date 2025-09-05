# Molecules Documentation

Molecules are simple combinations of atoms that form functional UI components. They represent groups of UI elements functioning together as a unit.

## 📋 Available Molecules

### Beatmap Molecules
- [BeatmapGrid](./BeatmapGrid.md) - Grid layout for beatmaps
- [BeatmapHeader](./BeatmapHeader.md) - Beatmap information header
- [BeatmapPreview](./BeatmapPreview.md) - Beatmap preview component
- [BeatmapHorizontalCard](./BeatmapHorizontalCard.md) - Horizontal beatmap card
- [BeatmapHorizontalCard Sub-components](./BeatmapHorizontalCard/README.md) - Sub-components breakdown

### Filter & Selection Molecules
- [DifficultyButtons](./DifficultyButtons.md) - Difficulty selection buttons
- [FilterSection](./FilterSection.md) - Filter controls section
- [RateSelector](./RateSelector.md) - Play rate selection
- [RoadmapFilters](./RoadmapFilters.md) - Roadmap-specific filters

### Chart Molecules
- [MSDRadarChart](./MSDRadarChart.md) - MSD radar visualization
- [MSDRatesLineChart](./MSDRatesLineChart.md) - MSD rates line chart

## 🎯 Design Principles

### Composition
Molecules are built by combining atoms:
- **2-5 atoms** typically compose a molecule
- **Single responsibility** for the combined functionality
- **Reusable** across different contexts
- **Self-contained** with minimal external dependencies

### Data Flow
```typescript
interface MoleculeProps {
  // Data props
  data: SomeDataType;
  
  // Event handlers
  onAction?: (data: SomeDataType) => void;
  
  // Configuration
  config?: MoleculeConfig;
}
```

### State Management
- Use local state for UI interactions
- Accept external state through props
- Emit events for parent components
- Use custom hooks for complex logic

## 🧩 BeatmapHorizontalCard Breakdown

The `BeatmapHorizontalCard` molecule has been refactored into sub-components:

### Sub-components
- **BeatmapCover** - Handles cover image display
- **BeatmapInfo** - Shows artist, title, and creator
- **BeatmapActions** - Contains download button
- **BeatmapBadges** - Manages difficulty and pattern badges
- **BeatmapFooter** - Displays status and difficulty range

### Hooks Used
- `useBeatmapHorizontalCard` - Main orchestration hook
- `useBeatmapCardActions` - Handles click and download actions
- `useSortedBeatmaps` - Sorts beatmaps by difficulty
- `useDisplayedBeatmaps` - Limits displayed beatmaps
- `useBeatmapPatterns` - Extracts unique patterns
- `useBeatmapStatus` - Determines priority status
- `useDifficultyRange` - Calculates difficulty range

## 🚀 Usage Guidelines

### Import Pattern
```typescript
import { 
  BeatmapGrid, 
  BeatmapHeader, 
  BeatmapPreview 
} from '@/components/molecules';
```

### Component Composition
```typescript
// Example: Building a beatmap list
<BeatmapGrid>
  {beatmaps.map(beatmap => (
    <BeatmapHorizontalCard 
      key={beatmap.id}
      beatmapset={beatmap}
      onClick={handleBeatmapClick}
    />
  ))}
</BeatmapGrid>
```

### Event Handling
```typescript
// Example: Handling molecule events
const handleBeatmapSelect = (beatmap: Beatmap) => {
  // Handle selection logic
};

<BeatmapPreview 
  beatmap={beatmap}
  onSelect={handleBeatmapSelect}
  onDownload={handleDownload}
/>
```

## 📊 Component Matrix

| Component | Atoms Used | Props | Events | State |
|-----------|------------|-------|--------|-------|
| BeatmapGrid | Badge, Image | beatmaps, columns | onBeatmapClick | ❌ |
| BeatmapHeader | Badge, Image | beatmapset | onAction | ❌ |
| BeatmapPreview | Badge, Button, Image | beatmap | onSelect, onDownload | ✅ |
| BeatmapHorizontalCard | Multiple | beatmapset | onClick, onDownload | ✅ |
| DifficultyButtons | Button | difficulties, selected | onSelect | ❌ |
| FilterSection | Input, Select | filters | onChange | ❌ |
| RateSelector | Button | rates, selected | onSelect | ❌ |
| MSDRadarChart | - | data | onPointClick | ✅ |

## 🔧 Development

### File Structure
```
molecules/
├── ComponentName/
│   ├── ComponentName.tsx
│   ├── SubComponent/
│   │   ├── SubComponent.tsx
│   │   └── index.ts
│   ├── index.ts
│   └── README.md
├── index.ts
└── README.md
```

### Custom Hooks
Molecules often use custom hooks for complex logic:
```typescript
// Example: Custom hook for molecule
const useBeatmapCard = (beatmap: Beatmap) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAction = useCallback(async () => {
    // Action logic
  }, []);
  
  return { isLoading, error, handleAction };
};
```

### Testing Strategy
- **Unit tests** for individual functionality
- **Integration tests** for atom composition
- **Visual regression tests** for UI consistency
- **Accessibility tests** for keyboard navigation

## 📚 Related Documentation

- [Atoms Documentation](../atoms/README.md)
- [Organisms Documentation](../organisms/README.md)
- [Hooks Documentation](../hooks/README.md)
- [BeatmapHorizontalCard Sub-components](./BeatmapHorizontalCard/README.md)
