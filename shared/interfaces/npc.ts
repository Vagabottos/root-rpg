
import { IItem } from './item';

export interface INPC {
  name: string;
  look: string;
  job: string;
  faction: string;
  attack: string;
  drive: string;
  equipment: IItem[];
  notes: string;

  harmMax: {
    injury: number;
    exhaustion: number;
    wear: number;
    morale: number;
  };

  harm: {
    injury: number;
    exhaustion: number;
    wear: number;
    morale: number;
  };
}
