import { SockJS } from 'sockjs';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  constructor() {   }

  setupSocketConnection() {
    this.socket = new WebSocket('ws://localhost:8080/EmbASPServerExecutor/home');
  }
}
