import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TweetService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  getTweets(): Observable<any[]> {
    return this.http.get<any[]>('/api/tweets');
  }

  createTweet(content: string): Observable<any> {
    return this.http.post('/api/tweets/create', { content });
  }

  editTweet(id: number, content: string): Observable<any> {
    return this.http.put('/api/tweets/edit', { id, content });
  }

  deleteTweet(id: number): Observable<any> {
    return this.http.delete(`/api/tweets/delete/${id}`);
  }

  likeTweet(tweetId: number): Observable<any> {
    return this.http.post('/api/likes/like', { tweetId });
  }

  unlikeTweet(tweetId: number): Observable<any> {
    return this.http.request('delete', '/api/likes/unlike', {
      body: { tweetId }
    });
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.userId || null;
  }
}
