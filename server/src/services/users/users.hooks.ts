import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';

import { Conflict } from '@feathersjs/errors';
import { attachCreatedAt, attachUpdatedAt } from '../../middleware/created-at';
import { disallow } from '../../middleware/disallow';

// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const duplicateEmail = async (context: HookContext): Promise<HookContext> => {
  const { email } = context.data;

  const { total } = await context.service.find({
    query: {
      email,
      $limit: 0
    }
  });

  if(total > 0) {
    throw new Conflict('Email already registered.');
  }

  return context;
};

export default {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ duplicateEmail, attachCreatedAt, attachUpdatedAt, hashPassword('password') ],
    update: [ hashPassword('password'),  authenticate('jwt') ],
    patch: [ disallow ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
