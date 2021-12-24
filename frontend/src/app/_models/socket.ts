import { EMessageReceiverStatus, Message } from './message';
import { Room } from './room';
import { User } from './user';

export enum SocketRecvName {
  // room
  RoomCreateOrUpdate = 'room:CoU',

  // friend
  FriendStatus = 'friend:status',

  // message
  MessageMsg = 'message:msg',
  MessageReceiverStatus = 'message:receiverStatus',
  MessageTyping = 'message:typing'
}

export enum SocketSendName {
  // message
  MessageNew = 'message:new',
  MessageReceiverStatus = 'message:receiverStatus',
  MessageTyping = 'message:typing'
}

export interface SocketFriendStatus {
  status: boolean;
  userId: string;
  socketId: string;
}

export interface SocketMessageNew {
  room: Room;
  message: Message;
  uuid: string;
}

export interface SocketMessageNewSend {
  room: string;
  msg: string;
  type: number;
  uuid: string;
}


export interface SocketMessageReceiverStatus {
  messageId: string;
  roomId: string;
  type: EMessageReceiverStatus;
  user: User;
}

export interface SocketMessageReceiverStatusSend {
  type: EMessageReceiverStatus;
  messageId: string;
}

export interface SocketMessageTyping {
  status: boolean;
  room: Room;
  user: User
}

export interface SocketMessageTypingSend {
  status: boolean;
  roomId: string;
}
