
import { sample } from 'lodash';
import { Inject } from 'typescript-ioc';

import { ICommand, ICommandArgs, ICommandResult } from '../interfaces';
import { EmojiService } from '../services/emoji';

export class RollCommand implements ICommand {

  @Inject private emojiService: EmojiService;

  help = 'Roll 2d6!';
  aliases = ['roll', 'r'];

  async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
    const { message } = cmdArgs;

    const pos = [0, 1, 2, 3, 4, 5];
    const dice = ['die1', 'die2', 'die3', 'die4', 'die5', 'die6'];

    const num1 = sample(pos) as number;
    const num2 = sample(pos) as number;

    message.reply(`you rolled ${num1 + num2 + 2} ${this.emojiService.getEmoji(dice[num1])} ${this.emojiService.getEmoji(dice[num2])}`);

    return { resultString: '' };
  }
}
