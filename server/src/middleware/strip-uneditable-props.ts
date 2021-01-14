
import { HookContext } from '@feathersjs/feathers';

export async function stripUneditableProps(context: HookContext): Promise<HookContext> {

  delete context.data.updatedAt;
  delete context.data.createdAt;
  delete context.data.owner;
  delete context.data._id;

  return context;
}
