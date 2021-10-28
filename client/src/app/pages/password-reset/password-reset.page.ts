import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UserAPIService } from '../../services/user.api.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private userAPI: UserAPIService
  ) { }

  public token = '';
  public isDoing = false;

  public resetForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  public validationMessages = {
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.' }
    ]
  };

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  handleSubmit() {
    if (this.isDoing) { return; }

    this.isDoing = true;

    this.userAPI.resetPassword({
      token: this.token,
      password: this.resetForm.get('password').value,
    })
      .subscribe({
        next: () => {
          this.notification.notify('Password successfully changed. Please log in');
          this.router.navigate(['/login']);
          this.isDoing = false;
        },
        error: (e) => {
          this.notification.notify('Failed to change password');
          this.isDoing = false;
        },
        complete: () => {
          this.isDoing = false;
        }
      });
  }

}
