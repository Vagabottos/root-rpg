import * as authentication from '@feathersjs/authentication';
import { ObjectId } from 'mongodb';

import { fastJoin } from 'feathers-hooks-common';

import { blockDeleteWithCampaign } from '../../middleware/block-character-delete';
import { fixObjectId } from '../../middleware/convert-id';
import { attachCreatedAt, attachUpdatedAt } from '../../middleware/created-at';
import { attachOwner, validateOwner } from '../../middleware/owner';
import { reformatCharacter } from '../../middleware/reformat-character';
import { cleanCharacter } from '../../middleware/clean-character';
import { disallow } from '../../middleware/disallow';
import { stripUneditableProps } from '../../middleware/strip-uneditable-props';
// Don't remove this comment. It's needed to format import lines nicely.

const resolvers = {
  joins: {
    campaignName: () => async (player, ctx) => {
      if(!player.campaign || player.campaign.length !== 24) return;

      const res = await ctx.app.service('campaign').find({
        query: { _id: new ObjectId(player.campaign), $select: ['name'] },
        paginate: false
      });

      player.campaignName = res[0]?.name;
    }
  }
};

const query = {
  campaignName: true
};

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
    find: [fastJoin(resolvers, query)],
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
