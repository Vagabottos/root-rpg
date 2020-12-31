import * as authentication from '@feathersjs/authentication';
import { fixObjectId } from '../../middleware/convert-id';
import { attachCreatedAt, attachUpdatedAt } from '../../middleware/created-at';
import { attachOwner, validateOwner } from '../../middleware/owner';
import { reformatCharacter } from '../../middleware/reformat-character';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [fixObjectId],
    get: [fixObjectId, validateOwner],
    create: [reformatCharacter, attachOwner, attachCreatedAt, attachUpdatedAt],
    update: [validateOwner, attachUpdatedAt],
    patch: [validateOwner, attachUpdatedAt],
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