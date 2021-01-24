import '@feathersjs/transport-commons';
import { Application } from './declarations';


export default function(app: Application): void {

  if(typeof app.channel !== 'function') {
    return;
  }

  app.on('connection', (connection: any): void => {
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult: any, { connection }: any): void => {
    if(connection) {
      app.channel('anonymous').leave(connection);
      app.channel('authenticated').join(connection);
    }
  });

  app.service('character').publish(() => undefined);
  app.service('campaign').publish(() => undefined);

  app.service('character-campaign-updates').publish((data, context) => {
    return app.channel(context.data.identifier).send(context.data);
  });
}
