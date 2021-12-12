import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Room } from '../_models/room';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class RoomService {

  constructor(private http: HttpClient) { }

  search(search: string, page: number = 1, size: number = 10) {
    const url = environment.apiEndpoint + 'room/search';
    const param : { [key: string]: string } = {
      page: page.toString(),
      size: size.toString()
    }
    if (search) {
      param['search'] = search;
    }
    return this.http.get<Room[]>(url, {params: param, ...httpOptions}).toPromise();
  }
}
