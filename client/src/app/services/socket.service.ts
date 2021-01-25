import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import * as io from 'socket.io-client';

import { ICharacter } from '../../interfaces';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;
  // private client: any;
  private channel: string;

  private campaignCharacterPatch: Subject<{ id: string; patch: Partial<ICharacter> }> = new Subject<{ id: string; patch: Partial<ICharacter> }>();

  public get campaignCharacterPatch$() {
    return this.campaignCharacterPatch.asObservable();
  }

  constructor(
  ) {}

  public init() {
    if (this.socket) { return; }

    this.socket = io(environment.apiUrl);
    this.watchUpdates();
  }

  public joinChannel(channel: string) {
    this.channel = channel;

    this.socket.emit('create', 'character-campaign-updates', {
      action: 'join',
      identifier: `campaign/${this.channel}`,
    });
  }

  public leaveChannel() {
    this.socket.emit('create', 'character-campaign-updates', {
      action: 'leave',
      identifier: `campaign/${this.channel}`,
    });

    this.channel = '';
  }

  public sendCharacterUpdate(id: string, patch: Partial<ICharacter>) {
    if (!this.channel) { return; }

    this.socket.emit('create', 'character-campaign-updates', {
      identifier: `campaign/${this.channel}`,
      action: 'update',
      id,
      patch
    });
  }

  private watchUpdates() {
    this.socket.on('character-campaign-updates created', (data) => {
      if (!data || data.action !== 'update') { return; }

      this.campaignCharacterPatch.next({ id: data.id, patch: data.patch });
    });
  }

}
