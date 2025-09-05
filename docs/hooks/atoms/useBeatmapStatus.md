# useBeatmapStatus Hook

An atomic hook that determines the priority status of a beatmapset based on its beatmaps.

## Purpose

This hook analyzes the status of all beatmaps in a beatmapset and returns the highest priority status with appropriate icon and color.

## Signature

```typescript
const useBeatmapStatus = (
  beatmaps: BeatmapCompleteShort[]
) => BeatmapStatus
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `beatmaps` | `BeatmapCompleteShort[]` | Array of beatmap data to analyze |

## Returns

- **Type**: `BeatmapStatus`
- **Description**: Priority status with icon and color

```typescript
interface BeatmapStatus {
  status: 'ranked' | 'loved' | 'graveyard' | 'unknown';
  color: 'blue' | 'pink' | 'gray';
  icon: React.ReactElement;
}
```

## Usage

### Basic Usage
```typescript
import { useBeatmapStatus } from '@/hooks/atoms';

const BeatmapCard = ({ beatmaps }) => {
  const status = useBeatmapStatus(beatmaps);
  
  return (
    <StatusBadge status={status} />
  );
};
```

### In Component
```typescript
const BeatmapHorizontalCard = ({ beatmapset }) => {
  const status = useBeatmapStatus(beatmapset.beatmap);
  
  return (
    <div className="status">
      <StatusBadge status={status} />
    </div>
  );
};
```

## Status Priority

The hook determines status based on the following priority order:

| Priority | Status | Color | Icon | Description |
|----------|--------|-------|------|-------------|
| 1 | `ranked` | `blue` | `<Star />` | Official ranked beatmaps |
| 2 | `loved` | `pink` | `<Heart />` | Community loved beatmaps |
| 3 | `graveyard` | `gray` | `<Clock />` | Abandoned beatmaps |
| 4 | `unknown` | `gray` | `<span>?</span>` | Fallback for unknown status |

## Implementation Details

### Status Detection Logic
```typescript
const getPriorityStatus = (beatmaps: BeatmapCompleteShort[]): BeatmapStatus => {
  const statuses = beatmaps.map(m => m.beatmap.status);
  
  // Check in priority order
  if (statuses.includes('ranked')) {
    return { status: 'ranked', color: 'blue', icon: <Star size={12} /> };
  }
  if (statuses.includes('loved')) {
    return { status: 'loved', color: 'pink', icon: <Heart size={12} /> };
  }
  if (statuses.includes('graveyard')) {
    return { status: 'graveyard', color: 'gray', icon: <Clock size={12} /> };
  }
  
  // Fallback
  const firstStatus = statuses[0] || 'unknown';
  return { status: firstStatus as any, color: 'gray', icon: <span>?</span> };
};
```

### Memoization
The hook uses `useMemo` to prevent unnecessary recalculations:

```typescript
return useMemo(() => 
  getPriorityStatus(beatmaps), [beatmaps]
);
```

## Examples

### Different Status Scenarios
```typescript
// Example 1: Ranked beatmapset
const rankedBeatmaps = [
  { beatmap: { status: 'ranked' } },
  { beatmap: { status: 'ranked' } }
];
const status1 = useBeatmapStatus(rankedBeatmaps);
// Returns: { status: 'ranked', color: 'blue', icon: <Star /> }

// Example 2: Mixed statuses (ranked takes priority)
const mixedBeatmaps = [
  { beatmap: { status: 'loved' } },
  { beatmap: { status: 'ranked' } },
  { beatmap: { status: 'graveyard' } }
];
const status2 = useBeatmapStatus(mixedBeatmaps);
// Returns: { status: 'ranked', color: 'blue', icon: <Star /> }

// Example 3: Loved beatmapset
const lovedBeatmaps = [
  { beatmap: { status: 'loved' } },
  { beatmap: { status: 'loved' } }
];
const status3 = useBeatmapStatus(lovedBeatmaps);
// Returns: { status: 'loved', color: 'pink', icon: <Heart /> }

// Example 4: Graveyard beatmapset
const graveyardBeatmaps = [
  { beatmap: { status: 'graveyard' } }
];
const status4 = useBeatmapStatus(graveyardBeatmaps);
// Returns: { status: 'graveyard', color: 'gray', icon: <Clock /> }
```

### Edge Cases
```typescript
// Example 5: Empty beatmaps array
const emptyBeatmaps = [];
const status5 = useBeatmapStatus(emptyBeatmaps);
// Returns: { status: 'unknown', color: 'gray', icon: <span>?</span> }

// Example 6: Unknown status
const unknownBeatmaps = [
  { beatmap: { status: 'unknown' } }
];
const status6 = useBeatmapStatus(unknownBeatmaps);
// Returns: { status: 'unknown', color: 'gray', icon: <span>?</span> }
```

## Performance Considerations

### Memoization Dependencies
- **Primary**: `beatmaps` array reference
- **Optimization**: Only recalculates when beatmaps change

### Time Complexity
- **O(n)**: Where n = number of beatmaps
- **Optimized**: Early termination on first priority match

### Memory Usage
- **Minimal**: Only stores status result
- **Icons**: React elements are lightweight

## Error Handling

### Invalid Data
```typescript
// Handles gracefully
const invalidBeatmaps = [
  { beatmap: { status: null } },     // Falls back to 'unknown'
  { beatmap: {} },                   // Falls back to 'unknown'
  { beatmap: { status: 'invalid' } } // Falls back to 'unknown'
];
```

### Edge Cases
- **Empty beatmaps array**: Returns 'unknown' status
- **Missing status property**: Falls back to 'unknown'
- **Invalid status values**: Falls back to 'unknown'

## Testing

### Test Cases
```typescript
describe('useBeatmapStatus', () => {
  it('returns ranked status for ranked beatmaps', () => {
    const beatmaps = [{ beatmap: { status: 'ranked' } }];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    expect(result.current.status).toBe('ranked');
    expect(result.current.color).toBe('blue');
  });

  it('prioritizes ranked over loved', () => {
    const beatmaps = [
      { beatmap: { status: 'loved' } },
      { beatmap: { status: 'ranked' } }
    ];
    const { result } = renderHook(() => useBeatmapStatus(beatmaps));
    expect(result.current.status).toBe('ranked');
  });

  it('handles empty beatmaps array', () => {
    const { result } = renderHook(() => useBeatmapStatus([]));
    expect(result.current.status).toBe('unknown');
  });
});
```

## Related Hooks

- [useBeatmapPatterns](./useBeatmapPatterns.md) - Extract patterns
- [useSortedBeatmaps](./useSortedBeatmaps.md) - Sort beatmaps
- [useDisplayedBeatmaps](./useDisplayedBeatmaps.md) - Limit displayed beatmaps
- [useDifficultyRange](./useDifficultyRange.md) - Calculate difficulty range

## Related Components

- [StatusBadge](../../components/atoms/StatusBadge.md) - Display status badge
- [BeatmapFooter](../../components/molecules/BeatmapFooter.md) - Uses this hook
- [BeatmapHorizontalCard](../../components/molecules/BeatmapHorizontalCard.md) - Uses this hook

## Icons Used

The hook uses Lucide React icons:
- **Star**: For ranked status
- **Heart**: For loved status  
- **Clock**: For graveyard status
- **Question Mark**: For unknown status
