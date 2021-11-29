import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ELoginFormField } from './model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  form: FormGroup;

  readonly ELoginFormField = ELoginFormField;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      [ELoginFormField.Username]: [null, Validators.required],
      [ELoginFormField.Password]: [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  submitSignIn() {
    console.log("Your username: ", this.username);
    const values = this.form.value;
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
