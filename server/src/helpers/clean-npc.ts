import { INPC } from '../../../shared/interfaces';
import { cleanItem } from './clean-item';
import { clean } from './clean-text';


export function cleanNPC(npc: INPC): void {
  npc.name = clean(npc.name);
  npc.look = clean(npc.look, 1000);
  npc.faction = clean(npc.faction);
  npc.drive = clean(npc.drive);
  npc.notes = clean(npc.notes, 1000);

  ['injury', 'exhaustion', 'depletion', 'morale'].forEach(harm => {
    npc.harmMax[harm] = Math.floor(Math.max(0, Math.min(5, npc.harmMax[harm])));
    npc.harm[harm] = Math.floor(Math.max(0, Math.min(5, npc.harm[harm])));
  });

  npc.equipment.forEach(item => cleanItem(item));
}