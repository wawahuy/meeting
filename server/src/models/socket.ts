import { MessageDocument, MessageReceiverStatus, MessageType } from "src/schema/message.schema";
import { RoomDocument } from "src/schema/room.schema";
import { UserDocument } from "src/schema/user.schema";

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

export interface SocketMessageNew {
  room: RoomDocument;
  message: MessageDocument;
  uuid: string;
}

export interface SocketMessageNewRecv {
  room: string;
  msg: string;
  type: MessageType;
  uuid: string;
}

export interface SocketMessageReceiverStatus {
  messageId: string;
  roomId: string;
  type: MessageReceiverStatus;
  user: UserDocument;
}

export interface SocketMessageReceiverStatusRecv {
  type: MessageReceiverStatus;
  messageId: string;
}