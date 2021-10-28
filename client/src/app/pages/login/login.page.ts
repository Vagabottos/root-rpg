import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../services/notification.service';
import { UserAPIService } from '../../services/user.api.service';

enum LoginState {
  Login,
  Register,
  Forgot,
};

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public get isStaging(): boolean {
    return environment.staging;
  }

  public LoginState = LoginState;
  public currentLoginState = LoginState.Login;
  public isDoing = false;

  public titles = {
    [LoginState.Login]: 'Log In',
    [LoginState.Register]: 'Sign Up',
    [LoginState.Forgot]: 'Reset Password',
  };

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
    private notification: NotificationService,
    private userAPI: UserAPIService
  ) { }

  ngOnInit() {
  }

  toggleRegister(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
    this.currentLoginState = this.currentLoginState === LoginState.Login ? LoginState.Register : LoginState.Login;
  }

  toggleForgot(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.currentLoginState = LoginState.Forgot;
  }

  resetPassword(): void {
    if (this.isDoing) { return; }

    this.isDoing = true;

    this.userAPI.sendResetPassword({
      email: this.authForm.get('email').value,
    })
      .subscribe({
        next: () => {
          this.notification.notify('Please check your email inbox for instructions.');
          this.isDoing = false;
        },
        error: () => {
          this.notification.notify('Could not send password reset. Please double check email.');
          this.isDoing = false;
        },
        complete: () => {
          this.isDoing = false;
        }
      });
  }

  auth() {
    if (this.isDoing) { return; }

    this.isDoing = true;

    const args = {
      email: this.authForm.get('email').value,
      password: this.authForm.get('password').value
    };

    const login = () => {
      this.userAPI.login(args)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard', 'characters']);
            this.isDoing = false;
          },
          error: () => {
            this.notification.notify('Invalid email or password.');
            this.isDoing = false;
          },
          complete: () => {
            this.isDoing = false;
          }
        });
    };

    if (this.currentLoginState === LoginState.Register) {
      this.userAPI.register(args)
        .subscribe({
          next: () => {
            login();
          },
          error: () => {
            this.notification.notify('Your registration failed, please try again with a different email or password.');
            this.isDoing = false;
          },
          complete: () => {
            this.isDoing = false;
          }
        });
      return;
    }

    login();
  }

  handleSubmit() {
    if (this.currentLoginState === LoginState.Forgot) {
      this.resetPassword();
    } else {
      this.auth();
    }
  }
}
