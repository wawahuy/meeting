import { computeOnlineTime } from 'src/app/_helpers/func';
import { NotifierService } from 'angular-notifier';
import { RoomService } from './../../../../_services/room.service';
import { Room } from 'src/app/_models/room';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import * as _ from 'lodash';
import { User } from 'src/app/_models/user';
import { DataList } from 'src/app/_models/common';
import { SocketService } from 'src/app/_services/socket.service';
import { SocketFriendStatus, SocketRecvName } from 'src/app/_models/socket';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  isLoading = true;
  currentRoomId = '';
  searchString = '';
  data: DataList<Room> = {
    total: 0,
    page: 0,
    size: 0,
    data: [],
  };

  get listRoom() {
    return this.data?.data || [];
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private roomService: RoomService,
    private notifierService: NotifierService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.loadData();
    this.initSocket();
  }

  initSocket() {
    this.socketService
      .fromEvent<Room>(SocketRecvName.RoomCreateOrUpdate)
      .subscribe((room) => {
        this.onUpdateOrAddRoom(room);
      });

    this.socketService
      .fromEvent<SocketFriendStatus>(SocketRecvName.FriendStatus)
      .subscribe((data) => {
        console.log(data);
      });
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSelectRoom(room: Room) {
    if (!this.data?.data) {
      return;
    }

    this.searchString = '';
    this.currentRoomId = room._id;
    this.onUpdateOrAddRoom(room);
  }

  onUpdateOrAddRoom(room: Room) {
    this.data.data = this.data.data.filter((item) => {
      return item._id !== room._id;
    });
    this.data.data = [room, ...this.data.data];
  }

  async loadData() {
    this.isLoading = true;
    this.data = await this.fetchData();
    this.isLoading = false;
  }

  onScroll = _.debounce(async (event: any) => {
    if (
      !this.isLoading &&
      !!this.data?.data?.length &&
      this.data?.data?.length < this.data?.total &&
      event.target.scrollHeight -
        event.target.clientHeight -
        event.target.scrollTop <=
        30
    ) {
      this.isLoading = true;
      const page = this.data.page + 1;
      const dataNew = await this.fetchData(page);
      this.data = {
        ...dataNew,
        data: this.data.data.concat(dataNew?.data),
      };
      this.isLoading = false;
    }
  }, 250);

  async fetchData(page: number = 1, size: number = 10) {
    const result = await this.roomService
      .search('', page, size)
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return Promise.resolve(null);
      });

    const r: DataList<Room> = {
      total: result?.total,
      page,
      size,
      data: result?.items,
    };
    return r;
  }

  getName(room: Room) {
    return this.roomService.getRoomName(room);
  }

  getOnlineTimeByUser(user: User) {
    return user.onlineLasted ? computeOnlineTime(user.onlineLasted) : '-';
  }

  getStatusRoom(room: Room) {
    return this.roomService.getStatusRoom(room);
  }
}
