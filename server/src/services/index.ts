import { Application } from '../declarations';
import users from './users/users.service';
import reference from './reference/reference.service';
import gm from './gm/gm.service';
import character from './character/character.service';
import campaign from './campaign/campaign.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(reference);
  app.configure(gm);
  app.configure(character);
  app.configure(campaign);
}
