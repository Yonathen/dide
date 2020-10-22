import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable, Subject, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // Our socket connection
  private socket;

  constructor() { }

  public create(): WebSocketSubject<any> {

    const webSocketSubject = webSocket({
      url: environment.SOCKET_ENDPOINT,
      openObserver: {
        next: () => console.log('Underlying WebSocket connection open')
      }
    });

    return webSocketSubject;
  }

}
