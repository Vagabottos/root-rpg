import { Injectable } from '@angular/core';

import { capitalize, cloneDeep, groupBy, sample, sampleSize } from 'lodash';
import { IRequest } from '../../../../shared/interfaces';

import { IContentConnection, IContentDrive, IContentFaction,
  IContentFeat, IContentItemTag, IContentStat, IContentMove, IContentNature,
  IContentSkill, IContentVagabond, IContent, IContentMapLayout,
  IContentFeatRisk, IContentItemPreset, IItem, IContentMoveCustomItem, content
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private content: IContent;

  constructor() {
    this.content = cloneDeep((content as any).default || content);
  }

  getAllContent(): IContent {
    return this.content;
  }

  getRandomTownName(): string {
    const { start, end } = this.content.core.clearinggen.town;

    return capitalize(sample(start) + sample(end));
  }

  getRandomForestName(): string {
    return this.getRandomTownName() + ' ' + capitalize(sample(this.content.core.clearinggen.forest));
  }

  getRandomName(): string {
    return sample(this.content.core.names);
  }

  getRandomJob(): string {
    return sample(this.content.core.jobs);
  }

  getRandomAttack(): string {
    let baseInjury = 1;
    let baseExhaustion = 0;
    let baseWear = 0;

    if (sample([true, false, false, false])) {baseInjury += 1;}
    if (sample([true, false, false, false, false])) {baseExhaustion += 1;}
    if (sample([true, false, false, false, false])) {baseWear += 1;}

    if (sample([true, false, false, false, false, false, false])) {
      baseWear += 1;
      baseWear += baseInjury;
      baseWear += baseExhaustion;

      baseInjury = 0;
      baseExhaustion = 0;
    }

    const arr = [
      { value: baseInjury, text: 'injury' },
      { value: baseExhaustion, text: 'exhaustion' },
      { value: baseWear, text: 'wear' }
    ];

    return arr.filter(x => x.value > 0).map(x => `${x.value} ${x.text}`).join(', ');
  }

  getRandomRequest(): IRequest {
    const doRef = sample(this.content.core.requests.do);

    return {
      do: doRef.text,
      from: sample(this.content.core.requests.requester),
      where: sample(this.content.core.requests.where),
      target: sample(this.content.core.requests[doRef.type])
    };
  }

  getRandomLandmarks(): string {
    return sampleSize(this.content.core.clearinggen.building, 2).join(', ');
  }

  getRandomProblems(): string {
    return sampleSize(this.content.core.clearinggen.problem, 2).join(', ');
  }

  getAllMapLayouts(): Record<string, IContentMapLayout> {
    return this.content.core.maplayouts;
  }

  getVagabonds(): string[] {
    return Object.keys(this.content.vagabonds);
  }

  getPronouns(): string[] {
    return this.content.core.pronouns;
  }

  getNames(): string[] {
    return this.content.core.names;
  }

  getJobs(): string[] {
    return this.content.core.jobs;
  }

  getStats(): string[] {
    return Object.keys(this.content.core.stats);
  }

  getStat(statName: string): IContentStat {
    return this.content.core.stats[statName];
  }

  getFeats(): string[] {
    return Object.keys(this.content.core.feats);
  }

  getRisks(): string[] {
    return Object.keys(this.content.core.featrisks);
  }

  getRisk(name: string): IContentFeatRisk {
    return this.content.core.featrisks[name];
  }

  getSpecies(): string[] {
    return this.content.core.species;
  }

  getDefaultFactions(): IContentFaction[] {
    return this.getFactions().filter(x => x.isDefault);
  }

  getFactions(): IContentFaction[] {
    return this.content.core.factions;
  }

  getVagabond(vagabond: string): IContentVagabond {
    return this.content.vagabonds[vagabond];
  }

  getTag(name: string): IContentItemTag {
    return this.content.core.itemtags[name];
  }

  getTags(tagSet: string): string[] {
    return Object.keys(this.content.core.itemtags).filter(x => this.content.core.itemtags[x].tagSet === tagSet);
  }

  getNatures(): string[] {
    return Object.keys(this.content.core.natures).sort();
  }

  getNature(name: string): IContentNature {
    return this.content.core.natures[name];
  }

  getNPCDrives(): string[] {
    return this.content.core.npcdrives.sort();
  }

  getDrives(): string[] {
    return Object.keys(this.content.core.drives).sort();
  }

  getDrive(name: string): IContentDrive {
    return this.content.core.drives[name];
  }

  getConnections(): string[] {
    return Object.keys(this.content.core.connections);
  }

  getConnection(name: string): IContentConnection {
    return this.content.core.connections[name];
  }

  getMovesByArchetype(): Record<string, Array<{ name: string; text: string }>> {
    return groupBy(this.getMoves().sort(), key => this.getMove(key).archetype);
  }

  getMoves(): string[] {
    return Object.keys(this.content.core.moves);
  }

  getMove(name: string): IContentMove {
    return this.content.core.moves[name];
  }

  getFeat(name: string): IContentFeat {
    return this.content.core.feats[name];
  }

  getBasicSkills(): string[] {
    return Object.keys(this.content.core.referencebasicmoves);
  }

  getBasicSkill(name: string): IContentSkill {
    return this.content.core.referencebasicmoves[name];
  }

  getCombatSkills(): string[] {
    return Object.keys(this.content.core.referenceskills);
  }

  getCombatSkill(name: string): IContentSkill {
    return this.content.core.referenceskills[name];
  }

  getTravelMoves(): string[] {
    return Object.keys(this.content.core.referencemoves).filter(x => this.getOtherMove(x).type === 'Travel');
  }

  getSpeciesMoves(): string[] {
    return Object.keys(this.content.core.referencemoves).filter(x => this.getOtherMove(x).type === 'Species');
  }

  getInstinctMoves(): string[] {
    return Object.keys(this.content.core.referencemoves).filter(x => this.getOtherMove(x).type === 'Instinct');
  }

  getReputationMoves(): string[] {
    return Object.keys(this.content.core.referencemoves).filter(x => this.getOtherMove(x).type === 'Reputation');
  }

  getOtherMove(name: string): IContentMove {
    return this.content.core.referencemoves[name];
  }

  getSkills(): string[] {
    return Object.keys(this.content.core.skills);
  }

  getSkill(name: string): IContentSkill {
    return this.content.core.skills[name];
  }

  getItemPresets(): IContentItemPreset[] {
    return this.content.core.itempresets;
  }

  getPremadeItems(): (IItem & { type: string })[] {
    return this.content.core.premadeitems;
  }

  getCustomItemData(tag: string): IContentMoveCustomItem {
    return this.content.core.customitemdata[tag];
  }

  getRandomNPCLook(): string {
    return `a ${this.getCreatedNPCPersonality()} ${this.getCreatedNPCRace().toLowerCase()} with ${this.getCreatedNPCPast()}`;
  }

  getCreatedNPCRace(): string {
    const races = this.content.core.npcgen.race;

    const choices = [];
    races.forEach(raceData => {
      for (let i = 0; i < raceData.weight; i++) { choices.push(raceData.name); }
    });

    return sample(choices);
  }

  getCreatedNPCPast(): string {
    return sample(this.content.core.npcgen.past);
  }

  getCreatedNPCPersonality(): string {
    return sample(this.content.core.npcgen.personality);
  }
}
