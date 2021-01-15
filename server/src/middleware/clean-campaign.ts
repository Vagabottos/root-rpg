
import { HookContext } from '@feathersjs/feathers';
import { truncate } from 'lodash';

import { ICampaign } from '../interfaces';

const TRUNC_OPTS = () => ({ length: 25, omission: '' });

const clean = (str: string) => truncate(str, TRUNC_OPTS());

export async function cleanCampaign(context: HookContext): Promise<HookContext> {

  const campaign: Partial<ICampaign> = context.data;

  if(campaign.name) {
    campaign.name = clean(campaign.name || 'Name');
  }

  if(campaign.factions) {
    campaign.factions = campaign.factions.map(f => clean(f));
  }

  return context;
}
