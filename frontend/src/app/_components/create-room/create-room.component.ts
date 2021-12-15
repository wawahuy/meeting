import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/_models/user';
import { UserService } from './../../_services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ECreateRoomFormField } from './model';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  isShow = false;
  isLoading: Boolean;

  selectedUsers: string[];
  listUser: User[];
  form: FormGroup;
  // readonly ECreateRoomFormField = ECreateRoomFormField;

  constructor(
    private userService: UserService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   [ECreateRoomFormField.Name]: [null],
    // });
    this.loadData();
    this.selectedUsers = [];
  }

  // isControlError(field: ECreateRoomFormField, type: string) {
  //   const control = this.form.controls[field];
  //   if (control.invalid && (control.touched || control.dirty)) {
  //     if (control.errors[type]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  public show() {
    this.isShow = true;
  }
  public hidden() {
    this.isShow = false;
  }

  submitCreateRoom() {
    console.log('Created');
  }

  async loadData() {
    this.isLoading = true;
    this.listUser = await this.userService.search('').catch((err) => {
      this.notifierService.notify(
        'error',
        err?.error?.message || 'Unknown Error'
      );
      return null;
    });
    this.isLoading = false;
  }

  addSelectedUsers(id: string) {
    this.selectedUsers.push(id);
    console.log(this.selectedUsers);
  }
}
