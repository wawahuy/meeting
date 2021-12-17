import { Injectable } from '@nestjs/common';
import { SocketSendName } from 'src/models/socket';
import { RoomDocument } from 'src/schema/room.schema';
import { UserDocument } from 'src/schema/user.schema';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketRoomService {

  constructor(
    private socketGateway: SocketGateway
  ) {
  }

  emitCreateUpdateRoom(room: RoomDocument) {
    room.users.forEach(item => {
      const socketIds = (<UserDocument>item.user).sockets;
      socketIds.forEach(socketId => {
        this.socketGateway.server.to(socketId).emit(
          SocketSendName.RoomCreateOrUpdate,
          room
        )
      })
    })
  }

}
