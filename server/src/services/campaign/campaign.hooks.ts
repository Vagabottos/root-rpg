import * as authentication from '@feathersjs/authentication';

import { fastJoin } from 'feathers-hooks-common';

import { cleanCampaign } from '../../middleware/clean-campaign';
import { fixObjectId } from '../../middleware/convert-id';
import { attachCreatedAt, attachUpdatedAt } from '../../middleware/created-at';
import { disallow } from '../../middleware/disallow';
import { reformatCampaign } from '../../middleware/reformat-campaign';
import { attachOwner, validateOwner } from '../../middleware/owner';
import { stripUneditableProps } from '../../middleware/strip-uneditable-props';
import { removeLinkedPlayers } from '../../middleware/remove-linked-players';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const resolvers = {
  joins: {
    characterNames: () => async (campaign, ctx) => {
      const res = await ctx.app.service('character').find({
        query: { campaign: campaign._id.toString(), $select: ['name'] },
        paginate: false
      });

      campaign.characterNames = res.map(x => x.name);
    }
  }
};

const query = {
  characterNames: true
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [fixObjectId],
    get: [fixObjectId],
    create: [reformatCampaign, attachOwner, attachCreatedAt, attachUpdatedAt],
    update: [disallow],
    patch: [validateOwner, stripUneditableProps, cleanCampaign, attachUpdatedAt],
    remove: [validateOwner]
  },

  after: {
    all: [],
    find: [fastJoin(resolvers, query)],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [removeLinkedPlayers]
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
