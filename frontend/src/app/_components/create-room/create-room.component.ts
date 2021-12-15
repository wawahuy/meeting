import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/_models/user';
import { UserService } from './../../_services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ECreateRoomFormField } from './model';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  searchString: string;
  roomName: string;

  isShow = true;
  isLoading: Boolean;
  searchLoading: Boolean;

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
    this.searchString = '';
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

  loadData = _.debounce(async () => {
    this.isLoading = true;
    this.listUser = await this.userService
      .search(this.searchString)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return null;
      });
    setTimeout(() => {
      this.isLoading = false;
    }, 450);
  }, 300);

  addSelectedUsers(id: string) {
    if (this.selectedUsers.includes(id)) {
      console.log(true);

      this.selectedUsers = this.selectedUsers.filter((item) => item !== id);
    } else this.selectedUsers.push(id);
    console.log(this.selectedUsers);
  }

  unselectAll() {
    this.selectedUsers = [];
  }
}
