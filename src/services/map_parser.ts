import { BeatmapDecoder } from 'osu-parsers';
import { beatmapService } from '../api/services';

export interface HitObject {
  startTime: number;
  endTime?: number;
  column: number;
  type: 'circle' | 'hold';
}

export class MapParserService {
  private static decoder = new BeatmapDecoder();

  static async parseOsuFile(beatmapId: number): Promise<HitObject[]> {
    try {
      // Récupérer le contenu du fichier .osu via notre API
      const osuFileContent = await beatmapService.getOsuFile(beatmapId);
      
      // Décoder avec osu-parsers
      const beatmap = await this.decoder.decodeFromString(osuFileContent, {
        parseGeneral: false,
        parseEditor: false,
        parseMetadata: false,
        parseDifficulty: false,
        parseEvents: false,
        parseTimingPoints: false,
        parseHitObjects: true,
        parseStoryboard: false,
        parseColours: false,
      });

      // Extraire les hit objects pour osu!mania 4K
      const maniaHitObjects: HitObject[] = [];
      
      beatmap.hitObjects.forEach(hitObject => {
        console.log(hitObject);
        // Convertir les coordonnées osu! en colonnes mania 4K
        const column = Math.floor((hitObject.startPosition.x / 512) * 4);
        
        if (hitObject.hitType === 128) { // Hold note
            maniaHitObjects.push({
                startTime: hitObject.startTime,
                endTime: hitObject.endTime,
                column,
                type: 'hold'
            });
        } else {
          maniaHitObjects.push({
            startTime: hitObject.startTime,
            column,
            type: 'circle'
          });
        }
      });

      return maniaHitObjects.sort((a, b) => a.startTime - b.startTime);
    } catch (error) {
      console.error('Erreur lors du parsing de la beatmap:', error);
      throw error;
    }
  }

  static generateFallbackData(totalTime: number): HitObject[] {
    const fallbackHitObjects: HitObject[] = [];
    const totalNotes = 50;
    
    for (let i = 0; i < totalNotes; i++) {
      fallbackHitObjects.push({
        startTime: (i / totalNotes) * totalTime,
        column: Math.floor(Math.random() * 4),
        type: Math.random() > 0.8 ? 'hold' : 'circle'
      });
    }

    return fallbackHitObjects;
  }
}
