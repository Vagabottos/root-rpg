import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignAPIService } from '../../services/campaign.api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.page.html',
  styleUrls: ['./create-campaign.page.scss'],
})
export class CreateCampaignPage implements OnInit {

  public isDoing = false;

  public campaignForm = new FormGroup({
    campaignName: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  public validationMessages = {
    campaignName: [
      { type: 'required', message: 'Campaign name is required.' },
      { type: 'minlength', message: 'Campaign name must be at least 4 characters long.' }
    ]
  };

  constructor(
    private router: Router,
    private notification: NotificationService,
    private campaignAPI: CampaignAPIService
  ) { }

  ngOnInit() {
  }

  create() {
    this.isDoing = true;

    const args = {
      name: this.campaignForm.get('campaignName').value
    };

    this.campaignAPI.createCampaign(args)
      .subscribe((campaign) => {
        this.notification.notify('Created campaign successfully!');
        this.router.navigate(['/dashboard', 'campaigns', 'view', campaign._id]);
        this.isDoing = false;
      }, () => {
        this.isDoing = false;
      });
  }

}
