import * as authentication from '@feathersjs/authentication';
import { blockDeleteWithCampaign } from '../../middleware/block-character-delete';
import { fixObjectId } from '../../middleware/convert-id';
import { attachCreatedAt, attachUpdatedAt } from '../../middleware/created-at';
import { attachOwner, validateOwner } from '../../middleware/owner';
import { reformatCharacter } from '../../middleware/reformat-character';
import { cleanCharacter } from '../../middleware/clean-character';
import { disallow } from '../../middleware/disallow';
import { stripUneditableProps } from '../../middleware/strip-uneditable-props';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [fixObjectId],
    get: [fixObjectId, validateOwner],
    create: [reformatCharacter, attachOwner, attachCreatedAt, attachUpdatedAt],
    update: [disallow],
    patch: [validateOwner, stripUneditableProps, cleanCharacter, attachUpdatedAt],
    remove: [validateOwner, blockDeleteWithCampaign]
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
