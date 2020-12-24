// Initializes the `gm` service on path `/gm`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Gm } from './gm.class';
import hooks from './gm.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'gm': Gm & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/gm', new Gm(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('gm');

  service.hooks(hooks);
}
