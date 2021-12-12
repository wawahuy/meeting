import { User } from "./user";

export interface CreateRoom {
    name: string;
    users: string[];
};
export interface RoomDetail{
    name: string;
    _id: string;
    users: {
        nickName: string;
        user: User;
    }[]
}
export interface Room {
    roomDetail: RoomDetail;
    messageLasted: any;
};