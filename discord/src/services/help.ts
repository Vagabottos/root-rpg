
import { AutoWired, Singleton } from 'typescript-ioc';
import { BaseService } from '../base/BaseService';

@Singleton
@AutoWired
export class HelpService extends BaseService {

  public get allHelp(): Array<{ command: string; aliases: string[]; help: string }> {
    return this.helpTexts;
  }

  private helpTexts: Array<{ command: string; aliases: string[]; help: string }> = [];

  public addHelp(help: { command: string; aliases: string[]; help: string }): void {
    this.helpTexts.push(help);
  }
}
