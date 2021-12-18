export enum SocketSendName {
  // room
  RoomCreateOrUpdate = 'room:CoU',

  // friend
  FriendStatus ='friend:status',

  // message
  MessageMsg = 'message:msg',
}

export enum SocketRecvName {
  // message
  MessageNew = 'message:new',
}

export interface SocketFriendStatus {
  status: boolean;
  userId: string;
  socketId: string;
}

export interface SocketMessageNewRecv {
  room: string;
  msg: string;
  type: number;
}