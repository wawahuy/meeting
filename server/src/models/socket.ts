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
  MessageTyping = 'message:typing',
  MessageReact = 'message:react',

  // call
  CallCall = 'call:call',
  CallAnswer = 'call:answer',
}

export enum SocketRecvName {
  // message
  MessageNew = 'message:new',
  MessageReceiverStatus = 'message:receiverStatus',
  MessageTyping = 'message:typing',
  MessageReact = 'message:react',

  // call
  CallCall = 'call:call',
  CallAnswer = 'call:answer',
}

export enum EActionSocket {
  Create = 'create',
  Update = 'update',
  Delete = 'delete'
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
  messageReply: string;
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

export interface SocketMessageTyping {
  room: RoomDocument;
  user: UserDocument
}

export interface SocketMessageTypingRecv {
  roomId: string;
}

export interface SocketMessageReact {
  messageId: string;
  roomId: string;
  user: UserDocument;
  react: string;
  action: EActionSocket
}

export interface SocketMessageReactRecv {
  messageId: string;
  react: string;
  action: EActionSocket
}