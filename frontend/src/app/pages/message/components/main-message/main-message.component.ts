import { Component, OnInit } from '@angular/core';
import { computeOnlineTime } from 'src/app/_helpers/func';
import { Room } from 'src/app/_models/room';
import { AuthService } from 'src/app/_services/auth.service';
import { RoomService } from 'src/app/_services/room.service';

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
    private roomService: RoomService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.roomService.roomSelected$.subscribe(r => this.roomCurrent = r);
  }

  getRoomName() {
    return this.roomService.getRoomName(this.roomCurrent).name;
  }

  getRoomOnlineTime() {
    const room = this.roomCurrent;
    const users = room.users.filter(
      item => item.user._id !== this.authService.currentUserValue._id
    )
    if (room.users?.length == 2) {
      const user = users?.[0]?.user;
      return user.onlineLasted ? computeOnlineTime(user.onlineLasted) : '-';
    } else {
      return users.map(u => (u.nickName || u.user.name)).join(', ');
    }
    return null;
  }
}
