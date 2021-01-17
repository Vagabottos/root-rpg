
import { HookContext } from '@feathersjs/feathers';
import { truncate } from 'lodash';

import { ICampaign } from '../interfaces';

const TRUNC_OPTS = () => ({ length: 25, omission: '' });

const clean = (str: string) => truncate(str, TRUNC_OPTS());

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
  }

  if(campaign.factions) {
    campaign.factions = campaign.factions.map(f => clean(f));
  }

  if(hasPlayers) {
    delete campaign.factions;
  }

  return context;
}
