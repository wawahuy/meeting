import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Room, RoomNameResult } from '../_models/room';
import { ResponseSearch } from '../_models/common';
import { BehaviorSubject, Subject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  public readonly roomSelectedSubject = new BehaviorSubject<Room>(null);
  public readonly roomSelected$ = this.roomSelectedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getRoomName(room: Room): RoomNameResult {
    if (!!room.name) {
      return {
        name: room.name
      };
    }

    const users = room.users.filter(
      (item) => item.user._id !== this.authService.currentUserValue._id
    );
    if (users.length >= 2) {
      const name = users
        .map((item) => item.user.name)
        .join(', ');
      return {
        name
      };
    } else {
      const r = users.map((item) => {
        return { username: item.user.username, name: item.user.name };
      });
      return {
        name: r[0].name,
        username: r[0].username
      };
    }
  }

  getStatusRoom(room: Room) {
    return (
      room.users.filter(
        (item) => item.user._id !== this.authService.currentUserValue._id
      ).some(item => item.user.sockets.length > 0)
    );
  }

  createRoomByUser(name: string = '', users: string[]) {
    const url = environment.apiEndpoint + 'room/create';
    const body: Object = {
      name: name.toString(),
      users: users,
    };
    return this.http.post<Room>(url, body, httpOptions).toPromise();
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
      .get<ResponseSearch<Room>>(url, { params: param, ...httpOptions })
      .toPromise();
  }
}
