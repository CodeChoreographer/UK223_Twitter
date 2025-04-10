import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  getComments(tweetId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/comments/${tweetId}`);
  }

  addComment(tweetId: number, content: string): Observable<any> {
    return this.http.post('/api/comments/add', { tweetId, content });
  }

  editComment(id: number, content: string): Observable<any> {
    return this.http.put('/api/comments/edit', { id, content });
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`/api/comments/delete/${id}`);
  }

  likeComment(commentId: number): Observable<any> {
    return this.http.post('/api/likes/comment/like', { commentId });
  }

  unlikeComment(commentId: number): Observable<any> {
    return this.http.request('delete', '/api/likes/comment/unlike', {
      body: { commentId }
    });
  }
}
