import { Message } from "./message";
import { Room } from "./room";

export enum SocketRecvName {
  // room
  RoomCreateOrUpdate = 'room:CoU',

  // friend
  FriendStatus ='friend:status',

  // message
  MessageMsg = 'message:msg',
}

export enum SocketSendName {
  // message
  MessageNew = 'message:new',
}

export interface SocketFriendStatus {
  status: boolean;
  userId: string;
  socketId: string;
}

export interface SocketMessageNew {
  room: Room,
  message: Message
}

export interface SocketMessageNewSend {
  room: string;
  msg: string;
  type: number;
}
