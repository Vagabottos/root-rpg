/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { AutoWired, Singleton } from 'typescript-ioc';
import * as Discord from 'discord.js';
import { FuzzySetContainer } from 'fuzzyset-obj';

import { BaseService } from '../base/BaseService';

import * as content from '../../../shared/_output/content.json';

interface IReferenceItem {
  name: string;
  type: string;
  text: string;
  extra?: any;
}

@Singleton
@AutoWired
export class ReferenceService extends BaseService {

  private reference: FuzzySetContainer<IReferenceItem> = new FuzzySetContainer<IReferenceItem>({ key: '_key' });

  public async init(client: Discord.Client): Promise<void> {
    super.init(client);

    this.loadAll();
  }

  public getItem(name: string): IReferenceItem {
    try {
      return this.reference.getFirst(name);
    } catch {
      return null;
    }
  }

  public formatItem(item: IReferenceItem): Discord.RichEmbed {
    if (item.type === 'vagabond') {
      return this.formatVagabond(item);
    }

    return this.formatDefault(item);
  }

  private formatVagabond(item: IReferenceItem): Discord.RichEmbed {
    const embed = new Discord.RichEmbed();

    const vaga: any = item.extra;

    embed.addField(vaga.archetype, vaga.description);

    embed.addField('Stats', Object.keys(vaga.stats).map((stat) => `**${stat}**: ${vaga.stats[stat]}`).join(' '));

    embed.addField('Adjectives', vaga.adjectives.join(', '), true);
    embed.addField('Demeanor', vaga.demeanor.join(', '), true);
    embed.addField('Items', vaga.items.join(', '), true);

    embed.addField('Drives', vaga.drives.map((x) => x.name).join(', '), true);
    embed.addField('Natures', vaga.natures.map((x) => x.name).join(', '), true);
    embed.addField('Moves', vaga.moves.map((x) => vaga.defaultMoves.includes(x.name) ? `**${x.name}**` : x.name).join(', '), true);

    if (vaga.numSkills > 0) {
      embed.addField(`Skills (Choose ${vaga.numSkills})`, vaga.skills.map((x) => x.name).join(', '), true);
    } else {
      embed.addField('Skills', vaga.skills.map((x) => x.name).join(', '), true);
    }

    if (vaga.chooseFeats > 0) {
      embed.addField(`Feats (Choose ${vaga.chooseFeats})`, vaga.feats.map((x) => x.name).join(', '), true);
    } else {
      embed.addField('Feats', vaga.feats.map((x) => x.name).join(', '), true);
    }

    return embed;
  }

  private formatDefault(item: IReferenceItem): Discord.RichEmbed {
    const embed = new Discord.RichEmbed();

    embed.addField(item.name, item.text);

    return embed;
  }

  private loadAll() {
    Object.keys(content.core.connections).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'connection', name: conn, text: content.core.connections[conn].text }));
    });

    Object.keys(content.core.drives).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'drive', name: conn, text: content.core.drives[conn].text }));
    });

    Object.keys(content.core.moves).forEach((conn) => {
      this.reference.add(Object.assign({
        _key: conn,
        type: 'move',
        name: `${conn} (${content.core.moves[conn].archetype})`,
        text: content.core.moves[conn].text
      }));
    });

    Object.keys(content.core.feats).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'feat', name: conn, text: content.core.feats[conn].text }));
    });

    Object.keys(content.core.factions).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'faction', name: conn, text: content.core.factions[conn].text }));
    });

    Object.keys(content.core.natures).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'nature', name: conn, text: content.core.natures[conn].text }));
    });

    Object.keys(content.core.skills).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'skill', name: conn, text: content.core.skills[conn].text }));
    });

    Object.keys(content.core.stats).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'stat', name: conn, text: content.core.stats[conn].text }));
    });

    Object.keys(content.core.itemtags).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'tag', name: conn, text: content.core.itemtags[conn].text }));
    });

    Object.keys(content.core.referencebasicmoves).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'move', name: conn, text: content.core.referencebasicmoves[conn].text }));
    });

    Object.keys(content.core.referencebasicmoves).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'move', name: conn, text: content.core.referencebasicmoves[conn].text }));
    });

    Object.keys(content.core.referencemoves).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'move', name: conn, text: content.core.referencemoves[conn].text }));
    });

    Object.keys(content.core.referenceskills).forEach((conn) => {
      this.reference.add(Object.assign({ _key: conn, type: 'skill', name: conn, text: content.core.referenceskills[conn].text }));
    });

    Object.keys(content.vagabonds).forEach((vaga) => {
      this.reference.add(Object.assign({
        _key: vaga,
        type: 'vagabond',
        name: vaga,
        text: content.vagabonds[vaga].description,
        extra: content.vagabonds[vaga]
      }));
    });
  }

}
