import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private http: HttpClient) {}

  async getHasFriend(id: string) {
    const url = environment.apiEndpoint + 'friend/has/' + id;

    const isFriend = await this.http.get(url, { ...httpOptions }).toPromise();

    return isFriend;
  }

  async addFriend(id: string) {
    const url = environment.apiEndpoint + 'friend/add/' + id;
    const addFriend = await this.http.get(url, { ...httpOptions }).toPromise();

    return addFriend;
  }
}
