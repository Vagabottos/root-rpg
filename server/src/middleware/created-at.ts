
import { HookContext } from '@feathersjs/feathers';

export async function attachCreatedAt(context: HookContext): Promise<HookContext> {
  context.data.createdAt = Date.now();

  return context;
}

export async function attachUpdatedAt(context: HookContext): Promise<HookContext> {
  context.data.updatedAt = Date.now();

  return context;
}
