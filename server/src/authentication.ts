import { ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';
import authManagement from 'feathers-authentication-management';
import * as feathersAuthentication from '@feathersjs/authentication';

import { Application } from './declarations';
import { disallow, iff } from 'feathers-hooks-common';
import notifier from './notifier';
const { authenticate } = feathersAuthentication.hooks;

declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }

  interface ServiceTypes {
    'authManagement': authManagement & ServiceAddons<any>;
  }
}

class AccountJWTAuthenticationService extends AuthenticationService {

}

export default function(app: Application): void {
  const authentication = new AccountJWTAuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
  app.configure(authManagement({
    service: '/users',
    skipIsVerifiedCheck: true,
    notifier: notifier(app)
  }, {}));

  const isAction = (...args) => (hook) => args.includes(hook.data.action);
  const service = app.service('authManagement');

  service.hooks({
    before: {
      create: [
        iff(
          isAction('passwordChange'),
          authenticate('jwt')
        ),
        iff(
          !isAction('passwordChange', 'sendResetPwd', 'resetPwdLong'),
          disallow('external')
        ),
      ],
    },
  });
}
