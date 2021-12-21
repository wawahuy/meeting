import { SocketMessageNewSend } from './../../../../_models/socket';
import { SocketService } from 'src/app/_services/socket.service';
import { MessageService } from './../../../../_services/message.service';
import { NotifierService } from 'angular-notifier';
import { FriendService } from './../../../../_services/friend.service';
import { Component, OnInit } from '@angular/core';
import { computeOnlineTime, autoScrollBottom } from 'src/app/_helpers/func';
import { Room } from 'src/app/_models/room';
import { AuthService } from 'src/app/_services/auth.service';
import { RoomService } from 'src/app/_services/room.service';
import { Message } from 'src/app/_models/message';
import {
  SocketMessageNew,
  SocketRecvName,
  SocketSendName,
} from 'src/app/_models/socket';
import { v4 as uuidv4 } from 'uuid';

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
  sending = false;

  roomCurrent: Room;
  messageRoom: Message[];

  message: string;

  constructor(
    private notifierService: NotifierService,
    private roomService: RoomService,
    private authService: AuthService,
    private friendService: FriendService,
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.initSocket();
    this.roomService.roomSelected$.subscribe(
      (r) => (this.roomCurrent = r) && this.loadMainMessage(r)
    );
  }

  loadMainMessage(r) {
    this.getHasFriend(r);
    this.fetchMessageByRoomId(r._id);
    autoScrollBottom('message-body');
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
    } else this.isConnect = false;
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
  getStatusRoom() {
    if (this.roomCurrent.users.length === 2)
      return this.roomService.getStatusRoom(this.roomCurrent);
  }

  fetchMessageByRoomId(
    roomId,
    search: string = '',
    page: number = 1,
    size: number = 10
  ) {
    this.messageService
      .getMessagesByRoomId(roomId, search, page, size)
      .then((result) => {
        const data = result;
        this.messageRoom = data.reverse();
      })
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return Promise.resolve(null);
      });
  }

  myMessage(message: Message) {
    const currentId = this.authService.currentUserValue._id;
    if (message?.user?._id !== currentId) return false;
    return true;
  }

  keyPressEvent(event) {
    if (!!this.message && event.keyCode === 13) this.sendMessage();
  }

  initSocket() {
    this.socketService
      .fromEvent<SocketMessageNew>(SocketRecvName.MessageMsg)
      .subscribe((data) => {
        if (data.room._id !== this.roomCurrent._id) return;
        const result = this.messageRoom.some((message, index) => {
          if (message._id === data.uuid) {
            this.messageRoom[index] = data.message;
            return true;
          }
          return false;
        });
        if (!result) {
          this.messageRoom.push(data.message);
        }
        if (data.message.user._id === this.authService.currentUserValue._id)
          this.sending = false;
      });
  }

  sendMessage() {
    if (!this.message) return;
    const data: SocketMessageNewSend = {
      msg: this.message,
      type: 1,
      room: this.roomCurrent._id,
      uuid: uuidv4(),
    };
    const message: Message = <any>{
      msg: data.msg,
      _id: data.uuid,
      type: data.type,
    };
    this.messageRoom.push(message);
    this.sending = true;
    this.message = '';
    this.socketService.emit(SocketSendName.MessageNew, data);
  }
}
