import { Service, MemoryServiceOptions } from 'feathers-memory';
import { Application } from '../../declarations';

export class CharacterCampaignUpdates extends Service {

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MemoryServiceOptions>, private app: Application) {
    super(options);
  }

  setup(app: Application): void {
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async create (data: any, params: any): Promise<any> {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current, params)));
    }

    const channel = data.identifier;
    const action = data.action;

    if(action === 'join') {
      const { connections } = this.app.channel(this.app.channels).filter(connection => {
        return connection.connectionId === params.connectionId;
      });

      connections.forEach(connection => {
        this.app.channel(channel).join(connection);
      });

    } else if(action === 'leave') {
      this.app.channel(channel).leave(connection => {
        return connection.connectionId === params.connectionId;
      });

    } else if(action === 'update') {
      this.app.channel(channel).emit(data);
    }
  }
}
