import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Room } from '../_models/room';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getRoomName(room: Room) {
    if (!!room.roomDetail.name) {
      return room.roomDetail.name;
    }
    if (room.roomDetail.users.length >= 3) {
      return room.roomDetail.users
        .filter(
          (item) => item.user._id !== this.authService.currentUserValue._id
        )
        .map((item) => item.user.name)
        .join(', ');
    } else
      return room.roomDetail.users
        .filter(
          (item) => item.user._id !== this.authService.currentUserValue._id
        )
        .map((item) => {
          return { username: item.user.username, name: item.user.name };
        });
  }

  getStatusRoom(room: Room) {
    return (
      room.roomDetail.users.filter(
        (item) => item.user._id !== this.authService.currentUserValue._id
      )[0].user.sockets.length > 0
    );
  }

  createRoomByUser(name: string = '', users: string[]) {
    const url = environment.apiEndpoint + 'room/create';
    const body: Object = {
      name: name.toString(),
      users: users,
    };
    return this.http.post(url, body, httpOptions).toPromise();
  }

  search(search: string, page: number = 1, size: number = 10) {
    const url = environment.apiEndpoint + 'room/search';
    const param: { [key: string]: string } = {
      page: page.toString(),
      size: size.toString(),
    };
    if (search) {
      param['search'] = search;
    }
    return this.http
      .get<Room[]>(url, { params: param, ...httpOptions })
      .toPromise();
  }
}
