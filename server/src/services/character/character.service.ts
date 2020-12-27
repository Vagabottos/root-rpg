// Initializes the `player` service on path `/player`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Character } from './character.class';
import hooks from './character.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'character': Character & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/character', new Character(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('character');

  service.hooks(hooks);
}
