import { Message } from "./message";
import { User } from "./user";

export interface CreateRoom {
  name: string;
  users: string[];
};
export interface Room {
  name: string;
  _id: string;
  users: {
    nickName: string;
    user: User;
  }[],
  messageLasted: Message;
};

export interface RoomNameResult {
  name?: string;
  username?: string;
}
