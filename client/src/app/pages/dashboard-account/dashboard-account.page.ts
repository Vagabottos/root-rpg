import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserAPIService } from '../../services/user.api.service';

@Component({
  selector: 'app-dashboard-account',
  templateUrl: './dashboard-account.page.html',
  styleUrls: ['./dashboard-account.page.scss'],
})
export class DashboardAccountPage implements OnInit {

  constructor(
    private alert: AlertController,
    private router: Router,
    public api: UserAPIService
  ) { }

  ngOnInit() {
  }

  async logout() {
    const alert = await this.alert.create({
      header: 'Log Out',
      message: `Are you sure you want to log out?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, log out',
          handler: () => {
            this.api.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    alert.present();
  }

}
