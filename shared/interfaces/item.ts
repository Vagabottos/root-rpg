
export enum ItemRange {
  Intimate = 'intimate',
  Close = 'close',
  Far = 'far'
}

export interface IItem {
  name: string;
  wear: number;
  wearUsed?: number;
  tags?: string[];
  ranges?: ItemRange[] | string[];
  skillTags?: string[];

  extraValue?: number;              // used for luxurious items
  designation?: string;             // used for ceremonial items
}