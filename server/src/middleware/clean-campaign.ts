
import { NotAcceptable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { truncate } from 'lodash';

import { ICampaign } from '../interfaces';

const TRUNC_OPTS = () => ({ length: 50, omission: '' });

const clean = (str: string) => truncate(str, TRUNC_OPTS()).trim();

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

  if(campaign.name) {
    campaign.name = clean(campaign.name || 'Name');
    if(!campaign.name) throw new NotAcceptable('No valid campaign name specified.');
  }

  if(campaign.factions) {
    campaign.factions = campaign.factions.map(f => clean(f)).filter(Boolean);
    if(!campaign.factions || campaign.factions.length === 0) throw new NotAcceptable('No valid campaign factions specified.');
  }

  if(hasPlayers) {
    delete campaign.factions;
  }

  return context;
}
