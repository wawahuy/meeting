import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../_services/auth.service';
import { ELoginFormField } from './model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  readonly ELoginFormField = ELoginFormField;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      [ELoginFormField.Username]: [null, Validators.required],
      [ELoginFormField.Password]: [null, Validators.required],
    });
  }

  async submitSignIn() {
    const values = this.form.value;
    await this.authService.login(values.username, values.password)
      .then(res => {
        this.router.navigate(['/message']);
      })
      .catch(err => {
        console.log(err);
        this.notifierService.notify('error', err?.error?.message || 'Unknown Error')
      })
  }

  isControlError(field: ELoginFormField, type: string) {
    const control = this.form.controls[field];
    if (control.invalid && (control.touched || control.dirty)) {
      if (control.errors[type]) {
        return true;
      }
    }
    return false;
  }
}
