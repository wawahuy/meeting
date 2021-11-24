import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/internal-compatibility';
import { environment } from 'src/environments/environment';
import { Message } from '../types/message';

const WS_ENDPOINT = environment.testWsEndpoint;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private socket$: WebSocketSubject<Message>;
  private messagesSubject = new Subject<Message>();
  public message$ = this.messagesSubject.asObservable();

  constructor() {}

  public connect() {
    this.socket$ = this.getNewWebsocket();
    this.socket$.subscribe(
      msg => {
        console.log('Recv msg:', msg.type);
        this.messagesSubject.next(msg);
      }
    )
  }

  public send(msg: Message) {
    console.log('DataService: send', msg.type);
    this.socket$.next(msg);
  }

  private getNewWebsocket(): WebSocketSubject<any> {
    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('DataService: connection OK');
        }
      },
      closeObserver: {
        next: () => {
          console.log('DataService: connection CLOSED');
          this.socket$ = undefined;
          this.connect();
        }
      }
    })
  }
}
