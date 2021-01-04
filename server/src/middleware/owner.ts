
import { NotAuthenticated, Forbidden } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';

export async function attachOwner(context: HookContext): Promise<HookContext> {

  const ownerId = context.params.user?._id;
  if(!ownerId) throw new NotAuthenticated('Not authenticated.');

  context.data.owner = ownerId;

  return context;
}

export async function validateOwner(context: HookContext): Promise<HookContext> {

  const ownerId = context.params.user?._id;
  if(!ownerId) throw new NotAuthenticated('Not authenticated.');

  const { total } = await context.service.find({
    query: {
      _id: context.id,
      owner: ownerId,
      $limit: 0
    }
  });

  if(total === 0) throw new Forbidden('Could not view that item.');

  return context;
}
