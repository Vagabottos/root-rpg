// Initializes the `player` service on path `/player`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Player } from './player.class';
import hooks from './player.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'player': Player & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/player', new Player(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('player');

  service.hooks(hooks);
}
