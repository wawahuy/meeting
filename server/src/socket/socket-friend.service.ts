import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SocketFriendStatus, SocketSendName } from 'src/models/socket';
import { FriendService } from 'src/modules/friend/friend.service';
import { UserDocument } from 'src/schema/user.schema';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketFriendService {

  constructor(
    private friendService: FriendService,
    @Inject(forwardRef(() => SocketGateway)) private socketGateway: SocketGateway
  ) {
  }

  async emitStatusAllFriend(userId: string, socketId: string, status: boolean) {
    const friendData = await this.friendService.getFriendOnline(userId);
    const d: SocketFriendStatus = {
      userId,
      status,
      socketId
    };
    if (friendData) {
      friendData.friends?.forEach((friend: UserDocument) => {
        friend.sockets.forEach(socketId => {
          this.socketGateway.server.to(socketId).emit(
            SocketSendName.FriendStatus,
            d
          )
        })
      })
    }
  }
}
