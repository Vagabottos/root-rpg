
import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../interfaces';
import { HelpService } from '../services/help';
import { EnvService } from '../services/env';
import { EmojiService } from '../services/emoji';

export class HelpCommand implements ICommand {

  @Inject private envService: EnvService;
  @Inject private helpService: HelpService;
  @Inject private emojiService: EmojiService;

  help = 'Display this message!';
  aliases = ['help'];

  async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
    const { message } = cmdArgs;

    const allHelp = this.helpService.allHelp;

    message.author.send(`
**__All Commands__**

${allHelp.map(({ aliases, help }) => `__${aliases.map((x) => `\`${this.envService.commandPrefix}${x}\``).join(', ')}__\n${help}\n`).join('\n')}`);

    message.reply('sent!');

    return { resultString: 'helped' };
  }
}
