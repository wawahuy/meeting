import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as moment from 'moment';
import { Socket } from 'socket.io';
import { SocketMessageNew, SocketMessageNewRecv, SocketMessageReceiverStatus, SocketMessageReceiverStatusRecv, SocketMessageTyping, SocketMessageTypingRecv, SocketSendName } from 'src/models/socket';
import { MessageService } from 'src/modules/message/message.service';
import { RoomService } from 'src/modules/room/room.service';
import { MessageDocument, MessageReceiverStatus, MessageType } from 'src/schema/message.schema';
import { RoomDocument } from 'src/schema/room.schema';
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
    if (!msg) {
      return;
    }

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

    const d: SocketMessageNew = {
      room,
      message,
      uuid: msg.uuid
    };

    room.users.forEach(item => {
      const socketIds = (<UserDocument>item.user).sockets;
      socketIds.forEach(socketId => {
        this.socketGateway.server.to(socketId).emit(
          SocketSendName.MessageMsg,
          d
        )
      })
    })
  }

  async onMessageReceiverStatus(client: Socket, data: SocketMessageReceiverStatusRecv) {
    if (!data) {
      return;
    }

    const message: MessageDocument = await this.messageService.get(data.messageId);
    if (!message) {
      return;
    }

    const user = client.data.user;
    if (message.user._id.toString() === user._id.toString()) {
      return;
    }

    const room: RoomDocument = await this.roomService.getByRoomUserId(message.room, user._id);
    if (!room) {
      return;
    }

    await this.messageService.addOrUpdateReceiver(
      message._id,
      user._id,
      data.type
    );

    const d: SocketMessageReceiverStatus = {
      messageId: message._id,
      roomId: room._id,
      type: data.type,
      user
    };
    
    room.users.forEach(item => {
      const socketIds = (<UserDocument>item.user).sockets;
      socketIds.forEach(socketId => {
        this.socketGateway.server.to(socketId).emit(
          SocketSendName.MessageReceiverStatus,
          d
        )
      })
    })
  }

  async onMessageTyping(client: Socket, data: SocketMessageTypingRecv) {
    const user = client.data.user;
    const room: RoomDocument = await this.roomService.getByRoomUserId(data.roomId, user._id);
    if (!room) {
      return;
    }

    const d: SocketMessageTyping = {
      room,
      user,
    }
  
    room.users.forEach(item => {
      if (user._id.toString() === item.user._id.toString()) {
        return;
      }
      const socketIds = (<UserDocument>item.user).sockets;
      socketIds.forEach(socketId => {
        this.socketGateway.server.to(socketId).emit(
          SocketSendName.MessageTyping,
          d
        )
      })
    })
  }
}
