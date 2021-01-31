/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import * as dotenv from 'dotenv';
dotenv.config();

import { Bot } from './bot';

const init = async () => {
  const bot = new Bot();

  try {
    bot.init();

  } catch (e) {

    // eslint-disable-next-line no-console
    console.error(e);

    process.exit(0);
  }
};

init();
