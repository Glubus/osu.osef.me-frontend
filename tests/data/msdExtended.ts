import type { MSDExtended } from '../../src/types/beatmap/extended';

export const createMockMSDExtended = (overrides: Partial<MSDExtended> = {}): MSDExtended => ({
  id: 1,
  beatmap_id: 1,
  overall: 20.0,
  stream: 15.0,
  jumpstream: 18.0,
  handstream: 12.0,
  stamina: 25.0,
  jackspeed: 22.0,
  chordjack: 16.0,
  technical: 19.0,
  rate: 1.0,
  main_pattern: 'stream',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides
});

export const mockMSDExtendedStream: MSDExtended = createMockMSDExtended({
  id: 1,
  beatmap_id: 1,
  overall: 15.5,
  stream: 20.0,
  jumpstream: 10.0,
  handstream: 8.0,
  stamina: 12.0,
  jackspeed: 5.0,
  chordjack: 3.0,
  technical: 7.0,
  rate: 1.0,
  main_pattern: 'stream'
});

export const mockMSDExtendedJumpstream: MSDExtended = createMockMSDExtended({
  id: 2,
  beatmap_id: 2,
  overall: 20.0,
  stream: 15.0,
  jumpstream: 25.0,
  handstream: 10.0,
  stamina: 18.0,
  jackspeed: 8.0,
  chordjack: 5.0,
  technical: 12.0,
  rate: 1.0,
  main_pattern: 'jumpstream'
});

export const mockMSDExtendedTechnical: MSDExtended = createMockMSDExtended({
  id: 3,
  beatmap_id: 3,
  overall: 25.5,
  stream: 12.0,
  jumpstream: 15.0,
  handstream: 8.0,
  stamina: 20.0,
  jackspeed: 10.0,
  chordjack: 6.0,
  technical: 30.0,
  rate: 1.0,
  main_pattern: 'technical'
});

export const mockMSDExtendedMultipleRates: MSDExtended[] = [
  createMockMSDExtended({
    id: 1,
    beatmap_id: 1,
    overall: 10.0,
    rate: 0.5,
    main_pattern: 'stream'
  }),
  createMockMSDExtended({
    id: 1,
    beatmap_id: 1,
    overall: 20.0,
    rate: 1.0,
    main_pattern: 'stream'
  }),
  createMockMSDExtended({
    id: 1,
    beatmap_id: 1,
    overall: 30.0,
    rate: 1.5,
    main_pattern: 'stream'
  })
];

export const mockMSDExtendedWithArrayPattern: MSDExtended = createMockMSDExtended({
  id: 4,
  beatmap_id: 4,
  overall: 22.0,
  stream: 18.0,
  jumpstream: 20.0,
  handstream: 15.0,
  stamina: 25.0,
  jackspeed: 12.0,
  chordjack: 8.0,
  technical: 16.0,
  rate: 1.0,
  main_pattern: '["stream", "jumpstream"]'
});

export const mockMSDExtendedWithJSONPattern: MSDExtended = createMockMSDExtended({
  id: 5,
  beatmap_id: 5,
  overall: 18.0,
  stream: 15.0,
  jumpstream: 22.0,
  handstream: 10.0,
  stamina: 20.0,
  jackspeed: 8.0,
  chordjack: 5.0,
  technical: 12.0,
  rate: 1.0,
  main_pattern: '["technical", "chordjack"]'
});
