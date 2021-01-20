
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INPC } from '../../../interfaces';

@Component({
  selector: 'app-npc',
  templateUrl: './npc.component.html',
  styleUrls: ['./npc.component.scss'],
})
export class NPCComponent implements OnInit {

  @Input() npc: INPC;
  @Output() update = new EventEmitter();

  constructor(
  ) { }

  ngOnInit() {
  }

}
