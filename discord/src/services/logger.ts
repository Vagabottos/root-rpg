/* eslint-disable no-console */

import { AutoWired, Singleton } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { BaseService } from '../base/BaseService';
import { ICommandResult } from '../interfaces';

@Singleton
@AutoWired
export class LoggerService extends BaseService {

  public async init(client: Discord.Client): Promise<void> {
    super.init(client);

    this.watchGlobalUncaughtExceptions();
  }

  log(...args: any[]): void {
    console.log(this.timeStamp(), ...args);
  }

  logCommandResult(result: ICommandResult): void {
    if (!result || (!result.result && !result.resultString)) { return; }
    this.log(result);
  }

  error(...args: any[]): void {
    console.error(this.timeStamp(), ...args);
  }

  private timeStamp() {
    return new Date();
  }

  private watchGlobalUncaughtExceptions() {
    process.on('uncaughtException', (e) => {
      this.error(e);
      process.exit(0);
    });
  }
}
