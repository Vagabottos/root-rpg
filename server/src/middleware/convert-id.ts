
import { HookContext } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';

export async function fixObjectId(context: HookContext): Promise<HookContext> {

  const _id = context.params.query?._id ?? '';

  if(context.params.query?._id && _id.length === 24) {
    context.params.query._id = new ObjectId(context.params.query._id);
  }

  const owner = context.params.query?.owner ?? '';
  if(context.params.query?.owner && owner.length === 24) {
    context.params.query.owner = new ObjectId(context.params.query.owner);
  }

  return context;
}
