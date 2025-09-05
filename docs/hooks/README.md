# Hooks Documentation

Custom hooks provide reusable stateful logic and side effects. They follow the atomic design methodology with atomic and molecular hooks.

## 📋 Available Hooks

### Atomic Hooks (`hooks/atoms/`)
Low-level hooks that handle specific data or state:

- [useBeatmapPatterns](./atoms/useBeatmapPatterns.md) - Extract beatmap patterns
- [useBeatmapStatus](./atoms/useBeatmapStatus.md) - Get beatmap priority status
- [useSortedBeatmaps](./atoms/useSortedBeatmaps.md) - Sort beatmaps by difficulty
- [useDisplayedBeatmaps](./atoms/useDisplayedBeatmaps.md) - Limit displayed beatmaps
- [useDifficultyRange](./atoms/useDifficultyRange.md) - Calculate difficulty range

### Molecular Hooks (`hooks/molecules/`)
Higher-level hooks that combine atomic hooks and handle complex logic:

- [useBeatmapCardActions](./molecules/useBeatmapCardActions.md) - Handle card interactions
- [useBeatmapHorizontalCard](./molecules/useBeatmapHorizontalCard.md) - Complete card logic

### Existing Hooks
- [useBeatmapCount](./existing/useBeatmapCount.md) - Get beatmap count
- [useBeatmapList](./existing/useBeatmapList.md) - Fetch beatmap list
- [useBeatmapPreview](./existing/useBeatmapPreview.md) - Beatmap preview data
- [useBeatmapset](./existing/useBeatmapset.md) - Fetch beatmapset
- [useDownload](./existing/useDownload.md) - Download functionality
- [useFilters](./existing/useFilters.md) - Filter management
- [useHelpContent](./existing/useHelpContent.md) - Help content
- [useMSD](./existing/useMSD.md) - MSD data
- [useRandomBeatmaps](./existing/useRandomBeatmaps.md) - Random beatmaps
- [useRoadmap](./existing/useRoadmap.md) - Roadmap data

## 🎯 Design Principles

### Atomic Design for Hooks
- **Atomic Hooks**: Single responsibility, pure functions
- **Molecular Hooks**: Combine atomic hooks, handle complex logic
- **Organism Hooks**: (Future) Complete feature logic

### Hook Rules
1. **Always start with `use`** prefix
2. **Call hooks at the top level** of components
3. **Don't call hooks inside loops, conditions, or nested functions**
4. **Return consistent data structures**
5. **Handle loading and error states**

### Naming Conventions
```typescript
// Atomic hooks: use + specific functionality
useBeatmapPatterns
useSortedBeatmaps
useDifficultyRange

// Molecular hooks: use + component/feature name
useBeatmapCardActions
useBeatmapHorizontalCard
useBeatmapList
```

## 🧩 Atomic Hooks

### useBeatmapPatterns
**Purpose**: Extract and process beatmap patterns
**Parameters**:
- `beatmaps: BeatmapCompleteShort[]`
- `maxPatterns: number = 3`

**Returns**: `string[]` - Array of unique patterns

**Usage**:
```typescript
const patterns = useBeatmapPatterns(beatmaps, 3);
// Returns: ['jumpstream', 'technical', 'stamina']
```

### useBeatmapStatus
**Purpose**: Determine priority status of beatmapset
**Parameters**:
- `beatmaps: BeatmapCompleteShort[]`

**Returns**: `BeatmapStatus` - Priority status with icon and color

**Usage**:
```typescript
const status = useBeatmapStatus(beatmaps);
// Returns: { status: 'ranked', color: 'blue', icon: <Star /> }
```

### useSortedBeatmaps
**Purpose**: Sort beatmaps by difficulty rating
**Parameters**:
- `beatmaps: BeatmapCompleteShort[]`

**Returns**: `BeatmapCompleteShort[]` - Sorted beatmaps

**Usage**:
```typescript
const sortedMaps = useSortedBeatmaps(beatmaps);
// Returns: beatmaps sorted by msd.overall ascending
```

### useDisplayedBeatmaps
**Purpose**: Limit displayed beatmaps with remaining count
**Parameters**:
- `beatmaps: BeatmapCompleteShort[]`
- `maxDisplayed: number = 5`

**Returns**: `{ displayedMaps, remainingCount }`

**Usage**:
```typescript
const { displayedMaps, remainingCount } = useDisplayedBeatmaps(beatmaps, 5);
// Returns: { displayedMaps: [...], remainingCount: 3 }
```

### useDifficultyRange
**Purpose**: Calculate difficulty range from beatmaps
**Parameters**:
- `beatmaps: BeatmapCompleteShort[]`

**Returns**: `{ minRating, maxRating } | null`

**Usage**:
```typescript
const range = useDifficultyRange(beatmaps);
// Returns: { minRating: 2.5, maxRating: 6.8 }
```

## 🧩 Molecular Hooks

### useBeatmapCardActions
**Purpose**: Handle card interactions (click, download)
**Parameters**:
- `beatmapset: BeatmapsetCompleteShort`
- `sortedMaps: BeatmapCompleteShort[]`

**Returns**: `{ handleClick, handleDownload }`

**Usage**:
```typescript
const { handleClick, handleDownload } = useBeatmapCardActions(beatmapset, sortedMaps);
```

### useBeatmapHorizontalCard
**Purpose**: Complete card logic orchestration
**Parameters**:
- `beatmapset: BeatmapsetCompleteShort`

**Returns**: All card data and actions

**Usage**:
```typescript
const {
  displayedMaps,
  remainingCount,
  uniquePatterns,
  priorityStatus,
  difficultyRange,
  handleClick,
  handleDownload
} = useBeatmapHorizontalCard(beatmapset);
```

## 🚀 Usage Guidelines

### Import Pattern
```typescript
// Atomic hooks
import { 
  useBeatmapPatterns, 
  useSortedBeatmaps,
  useDifficultyRange 
} from '@/hooks/atoms';

// Molecular hooks
import { 
  useBeatmapCardActions,
  useBeatmapHorizontalCard 
} from '@/hooks/molecules';
```

### Component Integration
```typescript
const BeatmapCard = ({ beatmapset }) => {
  // Use molecular hook for complete functionality
  const cardData = useBeatmapHorizontalCard(beatmapset);
  
  // Or use atomic hooks for specific needs
  const patterns = useBeatmapPatterns(beatmapset.beatmap);
  const sortedMaps = useSortedBeatmaps(beatmapset.beatmap);
  
  return (
    <div>
      {/* Render card */}
    </div>
  );
};
```

### Custom Hook Creation
```typescript
// Example: Creating a new atomic hook
const useBeatmapRating = (beatmaps: BeatmapCompleteShort[]) => {
  return useMemo(() => {
    const ratings = beatmaps.map(b => Number(b.msd?.overall ?? 0));
    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const max = Math.max(...ratings);
    const min = Math.min(...ratings);
    
    return { average, max, min, count: ratings.length };
  }, [beatmaps]);
};
```

## 📊 Hook Matrix

| Hook | Type | Parameters | Returns | Dependencies | Memoized |
|------|------|------------|---------|--------------|----------|
| useBeatmapPatterns | Atomic | beatmaps, maxPatterns | string[] | ✅ | ✅ |
| useBeatmapStatus | Atomic | beatmaps | BeatmapStatus | ✅ | ✅ |
| useSortedBeatmaps | Atomic | beatmaps | BeatmapCompleteShort[] | ✅ | ✅ |
| useDisplayedBeatmaps | Atomic | beatmaps, maxDisplayed | {displayedMaps, remainingCount} | ✅ | ✅ |
| useDifficultyRange | Atomic | beatmaps | {minRating, maxRating} \| null | ✅ | ✅ |
| useBeatmapCardActions | Molecular | beatmapset, sortedMaps | {handleClick, handleDownload} | ✅ | ✅ |
| useBeatmapHorizontalCard | Molecular | beatmapset | All card data | ✅ | ✅ |

## 🔧 Development

### File Structure
```
hooks/
├── atoms/
│   ├── useBeatmapPatterns.ts
│   ├── useBeatmapStatus.ts
│   ├── useSortedBeatmaps.ts
│   ├── useDisplayedBeatmaps.ts
│   ├── useDifficultyRange.ts
│   └── index.ts
├── molecules/
│   ├── useBeatmapCardActions.ts
│   ├── useBeatmapHorizontalCard.ts
│   └── index.ts
├── existing/
│   ├── useBeatmapCount.ts
│   ├── useBeatmapList.ts
│   └── ...
└── README.md
```

### Testing Strategy
- **Unit tests** for individual hook logic
- **Integration tests** for hook combinations
- **Performance tests** for memoization
- **Error handling tests** for edge cases

### Performance Considerations
- **Memoization**: Use `useMemo` and `useCallback` appropriately
- **Dependencies**: Keep dependency arrays minimal
- **Re-renders**: Avoid unnecessary re-renders
- **Memory leaks**: Clean up subscriptions and timers

## 🐛 Troubleshooting

### Common Issues
1. **Infinite re-renders**: Check dependency arrays
2. **Stale closures**: Use `useCallback` with proper dependencies
3. **Memory leaks**: Clean up effects properly
4. **Performance issues**: Optimize memoization

### Debug Tools
```typescript
// Example: Debug hook
const useDebugHook = (data: any) => {
  useEffect(() => {
    console.log('Hook data changed:', data);
  }, [data]);
  
  return data;
};
```

## 📚 Related Documentation

- [Atoms Documentation](../atoms/README.md)
- [Molecules Documentation](../molecules/README.md)
- [Organisms Documentation](../organisms/README.md)
- [React Hooks Guide](https://react.dev/reference/react)
- [Custom Hooks Best Practices](../best-practices/hooks.md)
