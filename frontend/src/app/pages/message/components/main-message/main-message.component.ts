import { User } from 'src/app/_models/user';
import {
  SocketMessageReceiverStatus,
  SocketMessageReceiverStatusSend,
  SocketMessageTyping,
  SocketMessageTypingSend,
} from './../../../../_models/socket';
import { SocketService } from 'src/app/_services/socket.service';
import { MessageService } from 'src/app/_services/message.service';
import { FriendService } from 'src/app/_services/friend.service';
import { AuthService } from 'src/app/_services/auth.service';
import { RoomService } from 'src/app/_services/room.service';
import { NotifierService } from 'angular-notifier';
import { computeOnlineTime, timeFormated } from 'src/app/_helpers/func';
import { Room } from 'src/app/_models/room';
import { EMessageReceiverStatus, Message } from 'src/app/_models/message';
import {
  SocketMessageNew,
  SocketRecvName,
  SocketSendName,
  SocketMessageNewSend,
} from 'src/app/_models/socket';
import { v4 as uuidv4 } from 'uuid';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { reactionIcon } from 'src/assets/enums';
import * as _ from 'lodash';

interface UserTyping {
  user: User;
  timeOut: any;
}
@Component({
  selector: 'app-main-message',
  templateUrl: './main-message.component.html',
  styleUrls: ['./main-message.component.scss'],
})
export class MainMessageComponent implements OnInit {
  @ViewChild('messageBody') private scrollToBottom: ElementRef;
  @ViewChild('inputMessage') private setInput: ElementRef;
  userConnect = {
    id: 2,
    username: 'Heyday',
    listMessage: [],
    status: false,
    lastActivity: '16:00 12/05/2021',
  };

  btnConnect = ['DISMISS', 'CONFIRM'];

  isConnect = false;
  sending = '';
  scrolled = false;
  isShowEmoji: false;
  isLoading = false;

  roomCurrent: Room;
  messageRoom: Message[];
  userTyping: UserTyping[] = [];

  message: string;
  timeKeyDown: number;

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
    this.socketReceiverStatus();
    this.socketTyping();
    this.roomService.roomSelected$.subscribe((r) => {
      if (!r) return;
      this.roomCurrent = r;
      this.loadMainMessage(r);
    });
  }

  //first load when subscribe room
  async loadMainMessage(r) {
    await Promise.all([this.getHasFriend(r), this.fetchMessageByRoomId(r._id)]);
    this.updateStatusMessage();
    setTimeout(() => {
      this.autoScrollBottom();
    });
  }

  autoScrollBottom() {
    try {
      this.scrollToBottom.nativeElement.scrollTop =
        this.scrollToBottom.nativeElement.scrollHeight;
    } catch (err) {}
  }

  //fetch check user select was your friend
  async getHasFriend(r) {
    const room = r;

    if (room.users.length === 2) {
      const user = room.users.filter(
        (item) => item.user._id !== this.authService.currentUserValue._id
      )[0];

      await this.friendService
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
  //call API add friend
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

  //get status of room
  getStatusRoom() {
    if (this.roomCurrent.users.length === 2)
      return this.roomService.getStatusRoom(this.roomCurrent);
  }

  //fetch list message of room select
  async fetchMessageByRoomId(
    roomId,
    search: string = '',
    page: number = 1,
    size: number = 20
  ) {
    this.isLoading = true;
    await this.messageService
      .getMessagesByRoomId(roomId, search, page, size)
      .then((result) => {
        const data = result;
        this.messageRoom = data.reverse();
        this.convertMessageData();
      })
      .catch((err) => {
        this.notifierService.notify(
          'error',
          err?.error?.message || 'Unknown Error'
        );
        return Promise.resolve(null);
      })
      .finally(() => {
        this.isLoading = false;
      })
  }

  //check message of current user
  myMessage(message: Message) {
    const currentId = this.authService.currentUserValue._id;
    if (message?.user?._id !== currentId) return false;
    return true;
  }

  keyDownEvent = (event) => {
    if (event.keyCode === 13) {
      const message = this.message?.trim();
      if (!!message) {
        this.sendMessage();
      }
      return false;
    }
  };

  //socket on event recieved message
  initSocket() {
    this.socketService
      .fromEvent<SocketMessageNew>(SocketRecvName.MessageMsg)
      .subscribe((data) => {
        //sent to server and client received

        this.sending = 'send';

        if (data.message.user._id !== this.authService.currentUserValue._id) {
          let status: number;

          if (data.room._id === this.roomCurrent._id) {
            status = EMessageReceiverStatus.Watched;
          } else status = EMessageReceiverStatus.Received;

          const statusSendMessage: SocketMessageReceiverStatusSend = {
            type: status,
            messageId: data.message._id,
          };

          this.socketService.emit(
            SocketRecvName.MessageReceiverStatus,
            statusSendMessage
          );
        }
        if (data.room._id !== this.roomCurrent._id) return;
        const result = this.messageRoom.some((message, index) => {
          if (message._id === data.uuid) {
            this.messageRoom[index] = data.message;
            // this.messageRoom[index].statusReceiver = [
            //   {
            //     type: EMessageReceiverStatus.Received,
            //     user: data.message.user,
            //   },
            // ];
            return true;
          }
          return false;
        });
        if (!result) {
          this.messageRoom.push(data.message);
          setTimeout(() => {
            this.autoScrollBottom();
          });
        }
        this.convertMessageData();
      });
  }
  updateStatusMessage() {
    this.messageRoom.forEach((msg) => {
      if (
        msg.user._id !== this.authService.currentUserValue._id &&
        msg.statusReceiver[0]?.type !== 2
      ) {
        const statusSendMessage: SocketMessageReceiverStatusSend = {
          type: EMessageReceiverStatus.Watched,
          messageId: msg._id,
        };

        this.socketService.emit(
          SocketSendName.MessageReceiverStatus,
          statusSendMessage
        );
      }
    });
  }
  socketReceiverStatus() {
    this.socketService
      .fromEvent<SocketMessageReceiverStatus>(
        SocketRecvName.MessageReceiverStatus
      )
      .subscribe((data) => {
        if (data.user._id !== this.authService.currentUserValue._id)
          this.sending = 'received';
        if (data.roomId !== this.roomCurrent._id) return;
        // this.fetchMessageByRoomId(data.roomId);
        this.messageRoom.some((msg) => {
          if (msg._id === data.messageId) {
            const isExist = msg.statusReceiver.some((item) => {
              if (item.user._id === data.user._id) {
                item.type = data.type;
                return true;
              }
              return false;
            });

            if (!isExist)
              msg.statusReceiver.push({ type: data.type, user: data.user });
            return true;
          }
          return false;
        });
      });
  }
  //update status message when Subscribe input message
  onSubscribe() {
    // this.updateStatusMessage();
  }

  //socket emit send message
  sendMessage() {
    if (!!this.message.trim() && !!this.message) {
      const data: SocketMessageNewSend = {
        msg: this.message.trim(),
        type: 1,
        room: this.roomCurrent._id,
        uuid: uuidv4(),
      };
      const message: Message = <any>{
        msg: data.msg,
        _id: data.uuid,
        type: data.type,
      };
      this.messageRoom.push({ ...message, ...{ myMess: true } });
      this.sending = 'sending';
      this.message = '';
      this.socketService.emit(SocketSendName.MessageNew, data);

      setTimeout(() => {
        this.autoScrollBottom();
      });
    }
  }

  //socket emit when typing
  keyPressEvent() {
    const t = new Date().getTime();
    if (!this.timeKeyDown || t - this.timeKeyDown > 1200) {
      const data: SocketMessageTypingSend = {
        roomId: this.roomCurrent._id,
      };
      this.socketService.emit(SocketSendName.MessageTyping, data);
      this.timeKeyDown = t;
    }
  }

  //socket on event typing
  socketTyping() {
    this.socketService
      .fromEvent<SocketMessageTyping>(SocketRecvName.MessageTyping)
      .subscribe((data) => {
        setTimeout(() => this.autoScrollBottom());
        if (!!data && data.room._id === this.roomCurrent._id) {
          const timeout = setTimeout(() => {
            this.removeTyping(data.user);
          }, 1500);
          let userFound = this.userTyping?.find(
            (item) => item.user._id === data.user._id
          );
          if (userFound) {
            clearTimeout(userFound.timeOut);
            userFound.timeOut = timeout;
          } else this.userTyping.push({ user: data.user, timeOut: timeout });
        }
      });
  }
  removeTyping(user: User) {
    this.userTyping = this.userTyping?.filter(
      (item) => item.user._id !== user._id
    );
  }
  getUserTyping() {
    return this.userTyping.map((item) => item.user.username).join(', ');
  }

  getRoomName() {
    return this.roomService.getRoomName(this.roomCurrent).name;
  }

  //Timer formated
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
  getTimeMessage(date: Date) {
    return timeFormated(date);
  }

  //convert list message isShowAvatar && isShowUsername
  convertMessageData() {
    let userId: string;
    for (let i = this.messageRoom.length - 1; i > -1; i--) {
      const item = this.messageRoom[i];
      if (item.user._id !== userId) {
        item.isShowAvatar = true;
        userId = item.user._id;
      } else item.isShowAvatar = false;
    }
    let id: string;
    for (let i = 0; i < this.messageRoom.length; i++) {
      const item = this.messageRoom[i];
      if (item.user._id !== id) {
        item.isShowName = true;
        id = item.user._id;
      } else item.isShowName = false;
    }
  }

  //add emoji into message
  insertEmoji(event) {
    if (!this.message) this.message = '';
    this.message = this.message + event.emoji.native;
  }

  //Reply
  messageReply: Message;
  isMessageReply: boolean = false;

  replyEvent(messageRep) {
    this.messageReply = messageRep;
    setTimeout(() => {
      this.autoScrollBottom();
    });
  }
  setUnReply() {
    this.messageReply = null;
  }

  //Reaction
  messageReactId: string;
  iconReact: string;

  reactionIconList = reactionIcon;

  setMessageReactClick(item) {
    this.messageRoom.some((msg, index) => {
      if (msg._id === item._id) {
        this.messageRoom[index].isShowReact = true;
      } else this.messageRoom[index].isShowReact = false;
    });
  }

  setReactForMessage(msg: Message, text: string) {
    this.messageRoom.some((item, index) => {
      if (item._id === msg._id && !!text) {
        if (!this.messageRoom[index].reacts)
          this.messageRoom[index].reacts = [];

        // check user reacted
        const itMeReact = this.messageRoom[index].reacts.find(
          (react) => react.user._id === this.authService.currentUserValue._id
        );

        //reacted
        if (!!itMeReact) {
          this.messageRoom[index].reacts.some((react, i) => {
            this.messageRoom[index].reacts[i].react = text;
          });
        } else {
          //not reaction
          this.messageRoom[index].reacts.push({
            user: this.authService.currentUserValue,
            react: text,
          });
        }
        this.messageRoom[index].isShowReact = false;
      }
    });
  }

  reactEvent(messageReact: Message, icon: string) {
    this.messageReactId = messageReact._id;
    this.iconReact = icon;
  }

  //usernames reacted
  getUserReact(react: any) {
    let temp = '';
    const users = react.map((item) => {
      if (item.user.username !== temp) {
        temp = item.user.username;
        return item.user.username;
      }
    });
    return users.join(', ');
  }

  unSetReact(msg: Message, icon: string) {
    this.messageRoom.some((item, index) => {
      if (item._id === msg._id) {
        if (!!this.messageRoom[index].reacts) {
          this.messageRoom[index].reacts = this.messageRoom[
            index
          ].reacts.filter(
            (react) =>
              react.user._id === this.authService.currentUserValue._id &&
              icon !== react.react
          );
        }
      }
    });
  }
}
