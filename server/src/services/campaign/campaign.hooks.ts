import * as authentication from '@feathersjs/authentication';
import { attachOwner, validateOwner } from '../../middleware/owner';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [validateOwner],
    create: [attachOwner],
    update: [validateOwner],
    patch: [validateOwner],
    remove: [validateOwner]
  },

  after: {
    all: [],
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
