import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAPIService } from '../../services/user.api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public isRegistering = false;
  public isDoing = false;

  public authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  public validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email must be a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.' }
    ]
  };

  constructor(
    private router: Router,
    private userAPI: UserAPIService
  ) { }

  ngOnInit() {
  }

  toggleRegister(): void {
    this.isRegistering = !this.isRegistering;
  }

  auth() {
    this.isDoing = true;

    const args = {
      email: this.authForm.get('email').value,
      password: this.authForm.get('password').value
    };

    const login = () => {
      this.userAPI.login(args)
        .subscribe(() => {
          this.router.navigate(['/player']);
          this.isDoing = false;
        }, () => {
          this.isDoing = false;
        });
    };

    if (this.isRegistering) {
      this.userAPI.register(args)
        .subscribe(() => {
          login();
        }, () => {
          this.isDoing = false;
        });
      return;
    }

    login();
  }

}
