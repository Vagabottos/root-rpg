
import { HookContext } from '@feathersjs/feathers';

export async function removeLinkedPlayers(context: HookContext): Promise<HookContext> {
  const mongo = await context.app.get('mongoClient');
  await mongo.collection('character').updateMany({ campaign: context.id }, { $set: { campaign: '' } });

  return context;
}
