import { RoomService } from './../../_services/room.service';
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
import { result } from 'lodash';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  searchString: string;
  roomName: string;

  isShow = false;
  isLoading: Boolean;
  isCreating: Boolean;

  selectedUsers: string[];
  listUser: User[];
  form: FormGroup;

  constructor(
    private userService: UserService,
    private notifierService: NotifierService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.selectedUsers = [];
    this.searchString = '';
  }

  public show() {
    this.isShow = true;
  }
  public hidden() {
    this.isShow = false;
  }

  async submitCreateRoom() {
    this.isCreating = true;
    if (this.selectedUsers.length > 0) {
      await this.roomService
        .createRoomByUser(this.roomName, this.selectedUsers)
        .then((result) => {
          if (result) {
            console.log(result);

            this.notifierService.notify('success', 'Created');
          }
        })
        .catch((err) => {
          this.notifierService.notify(
            'error',
            err?.error?.message || 'Unknown Error'
          );
          return null;
        });
    }
    setTimeout(() => {
      this.isCreating = false;
      this.isShow = false;
    }, 2000);
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
