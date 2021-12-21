import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as moment from 'moment';
import { Socket } from 'socket.io';
import { SocketMessageNewRecv, SocketMessageReceiverStatusRecv, SocketSendName } from 'src/models/socket';
import { MessageService } from 'src/modules/message/message.service';
import { RoomService } from 'src/modules/room/room.service';
import { MessageDocument, MessageType } from 'src/schema/message.schema';
import { UserDocument } from 'src/schema/user.schema';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketMessageService {
  constructor(
    private messageService: MessageService,
    private roomService: RoomService,
    @Inject(forwardRef(() => SocketGateway)) private socketGateway: SocketGateway
  ) {
  }

  async onMessageNew(client: Socket, msg: SocketMessageNewRecv) {
    const user: UserDocument = client.data.user;
    const room = await this.roomService.getByRoomUserId(msg.room, user._id);
    if (!room) {
      return;
    }

    if (!MessageType[msg.type]) {
      return;
    }

    const data: MessageDocument & any = {
      room: room._id,
      user: user._id,
      type: msg.type,
      msg: msg.msg
    };
    const result = await this.messageService.create(data);
    if (!result) {
      return;
    }

    const message = await this.messageService.get(result?.[0]._id);

    room.messageLasted = message._id;
    room.orderTime = <any>(moment().toDate());
    await room.save();

    room.users.forEach(item => {
      const socketIds = (<UserDocument>item.user).sockets;
      socketIds.forEach(socketId => {
        this.socketGateway.server.to(socketId).emit(
          SocketSendName.MessageMsg,
          {
            room,
            message,
            uuid: msg.uuid
          }
        )
      })
    })
  }

  async onMessageReceiverStatus(client: Socket, data: SocketMessageReceiverStatusRecv) {
    
  }
}
