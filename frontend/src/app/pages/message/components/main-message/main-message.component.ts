import { NotifierService } from 'angular-notifier';
import { FriendService } from './../../../../_services/friend.service';
import { Component, OnInit } from '@angular/core';
import { computeOnlineTime } from 'src/app/_helpers/func';
import { Room } from 'src/app/_models/room';
import { AuthService } from 'src/app/_services/auth.service';
import { RoomService } from 'src/app/_services/room.service';
import { result } from 'lodash';

@Component({
  selector: 'app-main-message',
  templateUrl: './main-message.component.html',
  styleUrls: ['./main-message.component.scss'],
})
export class MainMessageComponent implements OnInit {
  userConnect = {
    id: 2,
    username: 'Heyday',
    listMessage: [],
    status: false,
    lastActivity: '16:00 12/05/2021',
  };

  btnConnect = ['DISMISS', 'CONFIRM'];

  isConnect = false;

  roomCurrent: Room;

  constructor(
    private notifierService: NotifierService,
    private roomService: RoomService,
    private authService: AuthService,
    private friendService: FriendService
  ) {}

  ngOnInit(): void {
    this.roomService.roomSelected$.subscribe(
      (r) => (this.roomCurrent = r) && this.getHasFriend(r)
    );
  }

  getRoomName() {
    return this.roomService.getRoomName(this.roomCurrent).name;
  }

  getRoomOnlineTime() {
    const room = this.roomCurrent;
    const users = room.users.filter(
      (item) => item.user._id !== this.authService.currentUserValue._id
    );
    if (room.users?.length == 2) {
      const user = users?.[0]?.user;
      return user.onlineLasted ? computeOnlineTime(user.onlineLasted) : '-';
    } else {
      return users.map((u) => u.nickName || u.user.name).join(', ');
    }
    return null;
  }

  getHasFriend(r) {
    const room = r;

    if (room.users.length === 2) {
      const user = room.users.filter(
        (item) => item.user._id !== this.authService.currentUserValue._id
      )[0];

      this.friendService
        .getHasFriend(user.user._id)
        .then((result) => {
          if (!result) this.isConnect = true;
          else this.isConnect = false;
        })
        .catch((err) => {
          this.notifierService.notify(
            'error',
            err?.error?.message || 'Unknown Error'
          );
          return Promise.resolve(null);
        });
    }
  }

  addFriend() {
    const room = this.roomCurrent;
    const user = room.users.filter(
      (item) => item.user._id !== this.authService.currentUserValue._id
    )[0];
    this.friendService
      .addFriend(user.user._id)
      .then((result) => {
        if (result === 1) {
          this.isConnect = false;
          this.notifierService.notify(
            'success',
            user.user.name + ' has become your friend!'
          );
        }
      })
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return Promise.resolve(null);
      });
  }
}
