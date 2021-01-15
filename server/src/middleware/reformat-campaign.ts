
import { HookContext } from '@feathersjs/feathers';

import { ICampaign } from '../interfaces';

export async function reformatCampaign(context: HookContext): Promise<HookContext> {

  const newCampaign: ICampaign = {
    name: context.data.name,
    locked: false,
    factions: [
      'Denizens',
      'The Marquisate',
      'The Eyrie'
    ],
    clearings: {},
    forests: {}
  };

  // write this copy to the db
  context.data = newCampaign;

  return context;
}
