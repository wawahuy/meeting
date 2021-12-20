import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  getMessagesByRoomId(roomId, search, page, size) {
    const url = environment.apiEndpoint + 'message/search';
    const params: { [key: string]: string } = {
      roomId: roomId.toString(),
      search: search.toString(),
      page: page.toString(),
      size: size.toString(),
    };

    return this.http
      .get<Message[]>(url, { params: params, ...httpOptions })
      .toPromise();
  }
}
