# useBeatmapPatterns Hook

An atomic hook that extracts and processes beatmap patterns from beatmap data.

## Purpose

This hook parses beatmap MSD (Mania Skill Difficulty) data to extract unique patterns, handling various data formats and providing a clean array of pattern names.

## Signature

```typescript
const useBeatmapPatterns = (
  beatmaps: BeatmapCompleteShort[], 
  maxPatterns: number = 3
) => string[]
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `beatmaps` | `BeatmapCompleteShort[]` | - | Array of beatmap data to extract patterns from |
| `maxPatterns` | `number` | `3` | Maximum number of patterns to return |

## Returns

- **Type**: `string[]`
- **Description**: Array of unique pattern names, limited to `maxPatterns`

## Usage

### Basic Usage
```typescript
import { useBeatmapPatterns } from '@/hooks/atoms';

const BeatmapCard = ({ beatmaps }) => {
  const patterns = useBeatmapPatterns(beatmaps);
  
  return (
    <div>
      {patterns.map(pattern => (
        <PatternBadge key={pattern} pattern={pattern} />
      ))}
    </div>
  );
};
```

### With Custom Limit
```typescript
const patterns = useBeatmapPatterns(beatmaps, 5); // Get up to 5 patterns
```

### In Component
```typescript
const BeatmapHorizontalCard = ({ beatmapset }) => {
  const patterns = useBeatmapPatterns(beatmapset.beatmap, 3);
  
  return (
    <div className="patterns">
      {patterns.map(pattern => (
        <PatternBadge key={pattern} pattern={pattern} />
      ))}
    </div>
  );
};
```

## Implementation Details

### Pattern Parsing Logic
The hook handles multiple data formats:

1. **Array format**: `["jumpstream", "technical"]`
2. **JSON string**: `'["jumpstream", "technical"]'`
3. **Single string**: `"jumpstream"`
4. **Undefined/null**: Returns empty array

### Data Flow
```typescript
// Input: beatmap.msd.main_pattern
"jumpstream" → ["jumpstream"]
'["jumpstream", "technical"]' → ["jumpstream", "technical"]
["jumpstream", "technical"] → ["jumpstream", "technical"]
undefined → []
```

### Memoization
The hook uses `useMemo` to prevent unnecessary recalculations:

```typescript
return useMemo(() => {
  const allPatterns = new Set<string>();
  beatmaps.forEach(map => {
    const patterns = parseMainPatterns(map.msd?.main_pattern);
    patterns.forEach(pattern => allPatterns.add(pattern));
  });
  return Array.from(allPatterns).slice(0, maxPatterns);
}, [beatmaps, maxPatterns]);
```

## Examples

### Different Data Formats
```typescript
// Example 1: Array format
const beatmaps1 = [
  { msd: { main_pattern: ["jumpstream", "technical"] } },
  { msd: { main_pattern: ["stamina", "chordjack"] } }
];
const patterns1 = useBeatmapPatterns(beatmaps1);
// Returns: ["jumpstream", "technical", "stamina", "chordjack"]

// Example 2: JSON string format
const beatmaps2 = [
  { msd: { main_pattern: '["jumpstream", "technical"]' } }
];
const patterns2 = useBeatmapPatterns(beatmaps2);
// Returns: ["jumpstream", "technical"]

// Example 3: Single string format
const beatmaps3 = [
  { msd: { main_pattern: "jumpstream" } }
];
const patterns3 = useBeatmapPatterns(beatmaps3);
// Returns: ["jumpstream"]
```

### With Different Limits
```typescript
const beatmaps = [
  { msd: { main_pattern: ["jumpstream", "technical", "stamina", "chordjack"] } }
];

const patterns3 = useBeatmapPatterns(beatmaps, 3);
// Returns: ["jumpstream", "technical", "stamina"]

const patterns5 = useBeatmapPatterns(beatmaps, 5);
// Returns: ["jumpstream", "technical", "stamina", "chordjack"]
```

## Performance Considerations

### Memoization Dependencies
- **Primary**: `beatmaps` array reference
- **Secondary**: `maxPatterns` value
- **Optimization**: Only recalculates when dependencies change

### Memory Usage
- **Set operations**: Efficient deduplication
- **Array slicing**: Limits memory usage
- **Garbage collection**: Minimal object creation

### Time Complexity
- **O(n × m)**: Where n = number of beatmaps, m = average patterns per beatmap
- **Optimized**: Early termination with `maxPatterns` limit

## Error Handling

### Invalid Data
```typescript
// Handles gracefully
const beatmaps = [
  { msd: { main_pattern: "invalid-json" } }, // Falls back to string
  { msd: { main_pattern: null } },           // Returns empty array
  { msd: {} }                                // Returns empty array
];
```

### Edge Cases
- **Empty beatmaps array**: Returns empty array
- **Zero maxPatterns**: Returns empty array
- **Negative maxPatterns**: Returns empty array

## Testing

### Test Cases
```typescript
describe('useBeatmapPatterns', () => {
  it('extracts patterns from array format', () => {
    const beatmaps = [{ msd: { main_pattern: ["jumpstream", "technical"] } }];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    expect(result.current).toEqual(["jumpstream", "technical"]);
  });

  it('handles JSON string format', () => {
    const beatmaps = [{ msd: { main_pattern: '["jumpstream"]' } }];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps));
    expect(result.current).toEqual(["jumpstream"]);
  });

  it('limits results to maxPatterns', () => {
    const beatmaps = [{ msd: { main_pattern: ["a", "b", "c", "d"] } }];
    const { result } = renderHook(() => useBeatmapPatterns(beatmaps, 2));
    expect(result.current).toHaveLength(2);
  });
});
```

## Related Hooks

- [useBeatmapStatus](./useBeatmapStatus.md) - Get beatmap status
- [useSortedBeatmaps](./useSortedBeatmaps.md) - Sort beatmaps
- [useDisplayedBeatmaps](./useDisplayedBeatmaps.md) - Limit displayed beatmaps
- [useDifficultyRange](./useDifficultyRange.md) - Calculate difficulty range

## Related Components

- [PatternBadge](../../components/atoms/PatternBadge.md) - Display pattern badges
- [BeatmapBadges](../../components/molecules/BeatmapBadges.md) - Badge management
- [BeatmapHorizontalCard](../../components/molecules/BeatmapHorizontalCard.md) - Uses this hook
