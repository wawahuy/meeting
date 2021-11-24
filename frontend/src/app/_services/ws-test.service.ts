import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/internal-compatibility';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';

const WS_ENDPOINT = environment.testWsEndpoint;

@Injectable({
  providedIn: 'root'
})
export class WsTestService {

  private socket$: WebSocketSubject<Message>;
  private messagesSubject = new Subject<Message>();
  public message$ = this.messagesSubject.asObservable();
  public uuid = uuidv4();

  constructor() {}

  public connect() {
    if (this.socket$) {
      return;
    }
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
