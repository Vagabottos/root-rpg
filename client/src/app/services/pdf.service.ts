import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';

import { ICharacter } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  constructor() { }

  public exportCharacter(character: ICharacter) {
    const pdf = new jsPDF();

    pdf.save(`${character.name}.pdf`);
  }
}
