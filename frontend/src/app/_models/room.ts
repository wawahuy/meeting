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
  messageLasted: any;
};

export interface RoomNameResult {
  name?: string;
  username?: string;
}
