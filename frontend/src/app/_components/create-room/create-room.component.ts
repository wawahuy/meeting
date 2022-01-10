import { RoomService } from './../../_services/room.service';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/_models/user';
import { UserService } from './../../_services/user.service';
import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Room } from 'src/app/_models/room';
import { computeOnlineTime } from 'src/app/_helpers/func';
import { DataList } from 'src/app/_models/common';

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
  isLoadmore: Boolean;

  selectedUsers: User[];
  data: DataList<User> = {
    total: 0,
    page: 0,
    size: 0,
    data: [],
  };
  currentRoom: Room;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private notifierService: NotifierService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {}

  public show(r: Room) {
    if (!!r) this.currentRoom = r;
    this.isShow = true;
    this.selectedUsers = [];
    this.searchString = '';
    this.roomName = '';
    this.loadData();
  }
  public hidden() {
    this.isShow = false;
  }

  get listUser() {
    return this.data?.data || [];
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

  onScroll = _.debounce(async (event: any) => {
    if (
      !this.isLoadmore &&
      !!this.data?.data?.length &&
      this.data?.data?.length < this.data?.total &&
      event.target.scrollHeight -
        event.target.clientHeight -
        event.target.scrollTop <=
        30
    ) {
      this.isLoadmore = true;
      const page = this.data.page + 1;
      const dataNew = await this.fetchDataUser(page);
      this.isLoadmore = false;
      this.data = {
        ...dataNew,
        data: this.data.data.concat(dataNew?.data),
      };
    }
  }, 250);

  loadData = _.debounce(async () => {
    this.isLoading = true;
    const user = await this.fetchDataUser();
    this.data = user;
    this.isLoading = false;
  }, 300);

  async fetchDataUser(page: number = 1, size: number = 10) {
    const result = await this.userService
      .search(this.searchString, page, size)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return Promise.resolve(null);
      });
    const users = result?.items.filter(
      (elem) =>
        !this.currentRoom.users.find((user) => elem._id === user.user._id)
    );
    const u: DataList<User> = {
      total: result?.total,
      page,
      size,
      data: users,
    };
    return u;
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
