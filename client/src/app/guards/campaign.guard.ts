
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CampaignAPIService } from '../services/campaign.api.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignGuard implements CanActivate {

  constructor(
    private campaignAPI: CampaignAPIService,
    private router: Router
  ) {}

  // auto log in when refreshing page if needed
  canActivate(snapshot: ActivatedRouteSnapshot): Observable<boolean> {
    const id = snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/dashboard']);
      return;
    }

    return this.campaignAPI.loadCampaign(id)
      .pipe(
        catchError(err => {
          if (!err) { return; }

          this.router.navigate(['/dashboard']);

          return err;
        }),
        map(val => {
          console.log('check', val);
          const retVal = !!val;

          if (!retVal) {
            this.router.navigate(['/dashboard']);
            return false;
          }

          return true;
        })
      );
  }
}
