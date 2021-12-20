import { MessageReceiverStatus, MessageType } from "src/schema/message.schema";

export enum SocketSendName {
  // room
  RoomCreateOrUpdate = 'room:CoU',

  // friend
  FriendStatus ='friend:status',

  // message
  MessageMsg = 'message:msg',
  MessageReceiverStatus = 'message:receiverStatus',
}

export enum SocketRecvName {
  // message
  MessageNew = 'message:new',
  MessageReceiverStatus = 'message:receiverStatus',
}

export interface SocketFriendStatus {
  status: boolean;
  userId: string;
  socketId: string;
}

export interface SocketMessageNewRecv {
  room: string;
  msg: string;
  type: MessageType;
}

export interface SocketMessageReceiverStatusRecv {
  type: MessageReceiverStatus,
  user: string;
}