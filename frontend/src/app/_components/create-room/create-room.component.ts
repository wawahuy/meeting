import { RoomService } from './../../_services/room.service';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/_models/user';
import { UserService } from './../../_services/user.service';
import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Room } from 'src/app/_models/room';
import { computeOnlineTime } from 'src/app/_helpers/func';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  @Output() selectRoom = new EventEmitter<Room>();

  searchString: string;
  roomName: string;

  isShow = false;
  isLoading: Boolean;
  isCreating: Boolean;

  selectedUsers: User[];
  listUser: User[];
  form: FormGroup;

  constructor(
    private userService: UserService,
    private notifierService: NotifierService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {}

  public show() {
    this.isShow = true;
    this.selectedUsers = [];
    this.searchString = '';
    this.roomName = '';
    this.loadData();
  }
  public hidden() {
    this.isShow = false;
  }

  async submitCreateRoom() {
    this.isCreating = true;
    if (this.selectedUsers.length > 0) {
      const list = this.selectedUsers.map((user) => user._id);
      const d = await this.roomService
        .createRoomByUser(this.roomName, list)
        .catch((err) => {
          this.notifierService.notify(
            'error',
            err?.error?.message || 'Unknown Error'
          );
          return Promise.resolve(null);
        });

      this.isCreating = false;
      this.isShow = false;

      if (d) {
        this.selectRoom.emit(d);
      }
    }
  }

  loadData = _.debounce(async () => {
    this.isLoading = true;
    const [user] = await Promise.all([this.fetchDataUser()]);
    this.listUser = user;
    this.isLoading = false;
  }, 300);

  async fetchDataUser() {
    return await this.userService
      .search(this.searchString, 1, 10)
      .then((res) => res?.items)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return null;
      });
  }

  keyPressEvent(event) {
    const { keyCode } = event;

    if ((keyCode > 47 && keyCode < 91) || keyCode === 189 || keyCode === 8)
      this.loadData();
  }

  addSelectedUser(user: User) {
    if (this.userIncludes(user)) {
      this.selectedUsers = this.selectedUsers.filter(
        (item) => item._id !== user._id
      );
    } else this.selectedUsers.push(user);
  }

  userIncludes(user: User) {
    return this.selectedUsers.find((item) => item._id === user._id);
  }

  getOnlineTimeByUser(user: User) {
    return user.onlineLasted ? computeOnlineTime(user.onlineLasted) : '-';
  }

  unselectAll() {
    this.selectedUsers = [];
  }
}
