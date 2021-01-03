// Initializes the `reference` service on path `/reference`
import { ServiceAddons } from '@feathersjs/feathers';
import withJsonPatch from 'feathers-json-patch';

import { Application } from '../../declarations';
import { Reference } from './reference.class';
import hooks from './reference.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'reference': Reference & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  const CopyService = withJsonPatch(Reference);

  // Initialize our service with any options it requires
  app.use('/reference', new CopyService(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('reference');

  service.hooks(hooks);
}
