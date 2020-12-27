
import { HookContext } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';

export async function fixObjectId(context: HookContext): Promise<HookContext> {

  if(context.params.query?._id) context.params.query._id = new ObjectId(context.params.query._id);
  if(context.params.query?.owner) context.params.query.owner = new ObjectId(context.params.query.owner);

  return context;
}
