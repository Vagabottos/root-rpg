import { Injectable } from '@angular/core';

import * as feathers from '@feathersjs/client';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { ICharacter } from '../../../../shared/interfaces';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;
  private client: any;
  private channel: string;

  private campaignCharacterPatch: Subject<{ id: string, patch: Partial<ICharacter> }> = new Subject<{ id: string, patch: Partial<ICharacter> }>();

  public get campaignCharacterPatch$() {
    return this.campaignCharacterPatch.asObservable();
  }

  constructor(
  ) {}

  public init() {
    if (this.socket || this.client) { return; }

    this.socket = io(environment.apiUrl);
    this.client = feathers();

    this.client.configure(feathers.socketio(this.socket));
    this.client.configure(feathers.authentication());

    this.watchUpdates();
  }

  public joinChannel(channel: string) {
    this.channel = channel;

    this.client.service('character-campaign-updates').create({
      action: 'join',
      identifier: `campaign/${this.channel}`,
    });
  }

  public leaveChannel() {
    this.client.service('character-campaign-updates').create({
      action: 'leave',
      identifier: `campaign/${this.channel}`,
    });

    this.channel = '';
  }

  public sendCharacterUpdate(id: string, patch: Partial<ICharacter>) {
    if (!this.channel) { return; }

    this.client.service('character-campaign-updates').create({
      identifier: `campaign/${this.channel}`,
      action: 'update',
      id,
      patch
    });
  }

  private watchUpdates() {
    this.client.service('character-campaign-updates').on('created', (data) => {
      if (!data || data.action !== 'update') { return; }

      this.campaignCharacterPatch.next({ id: data.id, patch: data.patch });
    });
  }

}
