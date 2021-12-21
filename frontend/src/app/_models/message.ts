import { User } from './user';

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
  createdAt: Date;
  updatedAt: Date;
}
