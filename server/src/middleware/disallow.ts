
import { MethodNotAllowed } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';

export async function disallow(): Promise<HookContext> {

  throw new MethodNotAllowed('This HTTP verb is not supported.');

}
