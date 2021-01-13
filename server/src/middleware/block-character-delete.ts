
import { NotAuthenticated, MethodNotAllowed } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';

export async function blockDeleteWithCampaign(context: HookContext): Promise<HookContext> {

  const ownerId = context.params.user?._id;
  if(!ownerId) throw new NotAuthenticated('Not authenticated.');

  const { total } = await context.service.find({
    query: {
      _id: context.id,
      owner: ownerId,
      campaign: { $ne: null },
      $limit: 0
    }
  });

  if(total !== 0) throw new MethodNotAllowed('Cannot delete a character attached to a campaign; leave the campaign first.');

  return context;
}
