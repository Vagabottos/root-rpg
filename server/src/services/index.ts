import { Application } from '../declarations';
import users from './users/users.service';
import character from './character/character.service';
import campaign from './campaign/campaign.service';
import characterCampaignUpdates from './character-campaign-updates/character-campaign-updates.service';
import mailer from './mailer/mailer.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(character);
  app.configure(campaign);
  app.configure(characterCampaignUpdates);
  app.configure(mailer);
}
