
export enum ItemRange {
  Intimate = 'intimate',
  Close = 'close',
  Far = 'far'
}

export interface IItem {
  name: string;
  wear: number;
  wearUsed?: number;
  depletion?: number;
  depletionUsed?: number;
  tags?: string[];
  ranges?: ItemRange[] | string[];
  skillTags?: string[];
  tagSet?: string;                  // used for custom, permanent items & editing. cannot remove items with a tagset.

  extraLoad?: number;               // used for tinker toolbox
  extraValue?: number;              // used for luxurious items
  designation?: string;             // used for ceremonial items
  incendiary1?: string;             // used for incendiary items
  incendiary2?: string;             // used for incendiary items
  legendary1?: string;              // used for legendary items
  legendary2?: string;              // used for legendary items
  legendary?: number;               // used for legendary items
}
