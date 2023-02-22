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

  const account = await nodemailer.createTestAccount();

  const transporter = {
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    requireTLS: true,
    auth: {
      user: account.user,
      pass: account.pass
    }
  };

  // Initialize our service with any options it requires
  app.use('/mailer', Mailer(transporter, { from: account.user }));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');
  service.hooks(hooks);
}
