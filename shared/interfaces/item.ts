
export enum ItemRange {
  Intimate = 'intimate',
  Close = 'close',
  Far = 'far'
}

export interface IItem {
  name: string;
  wear: number;
  tags?: string[];
  ranges?: ItemRange[] | string[];
  skillTags?: string[];
}