import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@/services/auth.service';
import { Helpers } from '@/helper/helper';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage {
  public loginForm: FormGroup;

  public isAuthLoading: boolean = false;
  public error: any = null;

  constructor(
    private authService: AuthService,
    private helper: Helpers,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  get loginControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isAuthLoading = true;
      const payload = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }
      this.authService.loginByAuth(payload).subscribe(
        {
          next : (res) => {
            const userToken = res;
            // store user details in local storage to keep user logged in
            const token = this.helper.encodeBase64('currentUserToken');
            const dataToken = this.helper.encodeBase64(JSON.stringify(userToken));
            // Set to local storage
            localStorage.setItem(token, dataToken);
            this.authService.currentUserSubject.next(userToken);
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 100);
            this.isAuthLoading = false;
          },
          error: (err) => {
            console.log(err);
            this.error = err;
            this.isAuthLoading = false;
          }
        }
      )
    } else {
      this.error = {
        error: "Invalid Username or Password!",
        message: "Plese check the login form!"
      };
    }
    
  }

}
