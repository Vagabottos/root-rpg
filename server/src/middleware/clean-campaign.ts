
import { NotAcceptable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';

import { ICampaign } from '../interfaces';

import { clean } from '../helpers/clean-text';
import { ClearingStatus, ForestType, WarType } from '../../../shared/interfaces';
import { cleanNPC } from '../helpers/clean-npc';
import { ObjectId } from 'mongodb';

export async function cleanCampaign(context: HookContext): Promise<HookContext> {
  const characterService = context.app.service('character');

  let hasPlayers = false;

  try {
    const { total } = await characterService.find({
      query: {
        campaign: context.id,
        $limit: 0
      }
    });

    hasPlayers = total !== 0;

  } catch {}

  const campaign: Partial<ICampaign> = context.data;

  if(hasPlayers && context.data.kickPlayer) {
    const mongo = await context.app.get('mongoClient');
    await mongo.collection('character').updateOne({ _id: new ObjectId(context.data.kickPlayer) }, { $set: { campaign: '' } });

    delete context.data.kickPlayer;
  }

  // if campaign.data.kickplayer, kick and then delete

  if(campaign.name) {
    campaign.name = clean(campaign.name || 'Name');
    if(!campaign.name) throw new NotAcceptable('No valid campaign name specified.');
  }

  if(campaign.factions) {
    campaign.factions = campaign.factions.map(f => clean(f)).filter(Boolean);
    if(!campaign.factions || campaign.factions.length === 0) throw new NotAcceptable('No valid campaign factions specified.');
    if(campaign.factions.some(f => f.includes('.'))) throw new NotAcceptable('Campaign factions cannot have a period in them.');
  }

  if(campaign.notes) {
    campaign.notes = clean(campaign.notes, 10000);
  }

  if(campaign.npcs) {
    if(campaign.npcs.length >= 15) throw new NotAcceptable('Campaign must not have more than 15 unaffiliated NPCs.');
    campaign.npcs.forEach(npc => cleanNPC(npc));
  }

  if(campaign.sessionNotes) {
    campaign.sessionNotes.forEach(sessionNotes => {
      sessionNotes.notesText = clean(sessionNotes.notesText, 1000);
    });
  }

  if(campaign.clearings) {
    campaign.clearings.forEach(clearing => {
      clearing.name = clean(clearing.name, 25);
      clearing.status = clean(clearing.status, 15) as ClearingStatus;
      clearing.contestedBy = clean(clearing.contestedBy);
      clearing.controlledBy = clean(clearing.controlledBy);

      clearing.current.dominantFaction = clean(clearing.current.dominantFaction);
      clearing.current.overarchingIssue = clean(clearing.current.overarchingIssue, 1000);
      clearing.current.conflicts = clean(clearing.current.conflicts, 1000);
      clearing.current.ruler = clean(clearing.current.ruler);

      clearing.landscape.landmarks = clean(clearing.landscape.landmarks, 1000);
      clearing.landscape.locations = clean(clearing.landscape.locations, 1000);

      clearing.history.founder = clean(clearing.history.founder);
      clearing.history.legendaryFigures = clean(clearing.history.legendaryFigures, 1000);
      clearing.history.civilWarEvents = clean(clearing.history.civilWarEvents, 1000);
      clearing.history.interregnumEvents = clean(clearing.history.interregnumEvents, 1000);

      clearing.eventRecord.beforePlay = clean(clearing.eventRecord.beforePlay);
      clearing.eventRecord.visited.forEach(visitRecord => {
        visitRecord.visitText = clean(visitRecord.visitText, 1000);
        visitRecord.warContinuesType = clean(visitRecord.warContinuesType) as WarType;
        visitRecord.warContinuesText = clean(visitRecord.warContinuesText, 1000);
      });

      if(clearing.npcs.length >= 15) throw new NotAcceptable('Campaign must not have more than 15 unaffiliated NPCs.');
      clearing.npcs.forEach(npc => cleanNPC(npc));
    });
  }

  if(campaign.forests) {
    campaign.forests.forEach(forest => {
      forest.details = clean(forest.details, 5000);
      forest.location = clean(forest.location, 1000);
      forest.name = clean(forest.name, 50);
      forest.type = clean(forest.type, 10) as ForestType;
    });
  }

  if(hasPlayers) {
    delete campaign.factions;
  }

  return context;
}
