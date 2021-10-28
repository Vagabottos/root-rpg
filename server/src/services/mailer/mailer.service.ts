// Initializes the `mailer` service on path `/services/mailer`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import Mailer from 'feathers-mailer';
import hooks from './mailer.hooks';
import nodemailer from 'nodemailer';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'mailer': Mailer & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  app.use('/mailer', new Mailer(app.get('mail')));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');
  service.hooks(hooks);
}
