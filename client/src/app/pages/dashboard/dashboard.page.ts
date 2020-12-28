import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public get isCreating(): boolean {
    return window.location.href.includes('/create');
  }

  constructor(
  ) { }

  ngOnInit() {
  }

}
