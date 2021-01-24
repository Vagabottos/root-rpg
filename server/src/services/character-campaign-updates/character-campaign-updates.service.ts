// Initializes the `character-campaign-updates` service on path `/character-campaign-updates`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CharacterCampaignUpdates } from './character-campaign-updates.class';
import hooks from './character-campaign-updates.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'character-campaign-updates': CharacterCampaignUpdates & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/character-campaign-updates', new CharacterCampaignUpdates(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('character-campaign-updates');

  service.hooks(hooks);
}
