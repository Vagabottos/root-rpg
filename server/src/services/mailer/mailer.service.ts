// Initializes the `mailer` service on path `/services/mailer`
import { ServiceAddons } from '@feathersjs/feathers';
import Mailer from 'feathers-mailer';
import nodemailer from 'nodemailer';
import { Application } from '../../declarations';
import hooks from './mailer.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'mailer': Mailer & ServiceAddons<any>;
  }
}

export default async function (app: Application): Promise<void> {

  // Initialize our service with any options it requires
  const defaultMailSettings = app.get('mail');
  const transport = nodemailer.createTransport({
    service: 'Mandrill',
    auth: {
      user: defaultMailSettings.auth.user,
      pass: defaultMailSettings.auth.pass
    },
    logger: true,
    debug: true
  });

  app.use('/mailer', Mailer(transport, defaultMailSettings));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');
  service.hooks(hooks);
}
