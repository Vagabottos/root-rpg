import { Inject } from 'typescript-ioc';
import { ICommand, ICommandArgs, ICommandResult } from '../interfaces';
import { ReferenceService } from '../services/reference';

export class LookupCommand implements ICommand {

  @Inject private reference: ReferenceService;

  help = 'Look up anything about Root RPG!';
  aliases = ['lookup', 'reference', 'ref', 'l'];

  async execute(cmdArgs: ICommandArgs): Promise<ICommandResult> {
    const { message, args } = cmdArgs;

    const ref = this.reference.getItem(args);
    if (!ref) {
      message.channel.send(`Sorry! I could not find anything like "${args}"`);
      return;
    }

    const embed = this.reference.formatItem(ref);
    message.channel.send({ embed });

    return { resultString: args };
  }
}
