import { computeOnlineTime } from 'src/app/_helpers/func';
import { NotifierService } from 'angular-notifier';
import { RoomService } from './../../../../_services/room.service';
import { Room } from 'src/app/_models/room';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import * as _ from 'lodash';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  isLoading = true;
  listRoom: Room[];
  currentRoomId = '';
  searchString = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private roomService: RoomService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadData = _.debounce(async () => {
    this.isLoading = true;
    this.listRoom = await this.roomService.search('').catch((err) => {
      this.notifierService.notify(
        'error',
        err?.error?.message || 'Unknown Error'
      );
      return null;
    });
    this.isLoading = false;
  }, 250);

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
