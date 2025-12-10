import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CommentService implements OnDestroy {
  private apiUrl = 'http://localhost:3000/api/comments';

  private socket: Socket;

  private newCommentSubject = new Subject<any>();
  private notificationSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    // Initialize socket connection
    this.socket = io('http://localhost:3000', {
      withCredentials: false,
      transports: ['websocket', 'polling'],
    });

    // Listen for real-time events from backend
    this.socket.on('newComment', (comment) => {
      this.newCommentSubject.next(comment);
    });

    this.socket.on('notification', (data) => {
      this.notificationSubject.next(data);
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
  }

  addComment(comment: { content: string; article: string; parent?: string }): Observable<any> {
    return this.http.post(this.apiUrl, comment);
  }

  getComments(articleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${articleId}`);
  }

  // Real-time Observables
  getNewComment(): Observable<any> {
    return this.newCommentSubject.asObservable();
  }

  getNotification(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null!;
    }
  }
}