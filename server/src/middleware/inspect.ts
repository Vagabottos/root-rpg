
import { HookContext } from '@feathersjs/feathers';

export async function inspect(context: HookContext): Promise<HookContext> {
  console.log(context.data);
  return context;
};
