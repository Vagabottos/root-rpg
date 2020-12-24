import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor() { }

  public apiUrl(ext: string) {
    return environment.apiUrl + ext;
  }
}
