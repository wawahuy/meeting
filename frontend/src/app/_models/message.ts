import { User } from './user';

export enum EMessageReceiverStatus {
  Received = 1,
  Watched = 2,
}

export interface MessageStatusReceiver {
  type: number;
  user: User;
}

export interface Message {
  _id: string;
  msg: string;
  type: number;
  user: User;
  room: string;
  statusReceiver: MessageStatusReceiver[];
  messageReply: Message;
  createdAt: Date;
  updatedAt: Date;
  isShowAvatar: boolean;
  isShowName: boolean;
}
