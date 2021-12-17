export enum SocketSendName {
  // room
  RoomCreateOrUpdate = 'room:CoU',

  // friend
  FriendStatus ='friend:status'
}

export interface SocketFriendStatus {
  status: boolean;
  userId: string;
}