import { Component, OnInit } from '@angular/core';
import { UserAPIService } from '../../services/user.api.service';

@Component({
  selector: 'app-dashboard-account',
  templateUrl: './dashboard-account.page.html',
  styleUrls: ['./dashboard-account.page.scss'],
})
export class DashboardAccountPage implements OnInit {

  constructor(
    public api: UserAPIService
  ) { }

  ngOnInit() {
  }

}
