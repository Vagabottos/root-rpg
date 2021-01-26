
import { IItem } from './item';

export interface INPC {
  name: string;
  look: string;
  faction: string;
  drive: string;
  equipment: IItem[];
  notes: string;

  harmMax: {
    injury: number;
    exhaustion: number;
    depletion: number;
    morale: number;
  };

  harm: {
    injury: number;
    exhaustion: number;
    depletion: number;
    morale: number;
  };
}
