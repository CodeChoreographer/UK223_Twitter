import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tweetText = '';
  message = '';
  tweets: any[] = [];
  currentUser: { userId: number, username: string } | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.decodeJWT();
    this.loadTweets();
  }

  decodeJWT(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.currentUser = {
          userId: decoded.userId,
          username: decoded.username
        };
      } catch (e) {
        console.error('JWT ungültig', e);
        this.currentUser = null;
      }
    }
  }

  submitTweet(): void {
    if (!this.currentUser) return;

    const tweet = {
      userId: this.currentUser.userId,
      username: this.currentUser.username, // wichtig!
      content: this.tweetText
    };

    this.http.post('/api/tweets/create', tweet).subscribe({
      next: () => {
        this.message = 'Beitrag erfolgreich erstellt!';
        this.tweetText = '';
        this.loadTweets();
      },
      error: () => {
        this.message = 'Fehler beim Erstellen des Beitrags.';
      }
    });
  }

  loadTweets(): void {
    this.http.get<any[]>('/api/tweets').subscribe({
      next: (data) => this.tweets = data.reverse(),
      error: () => {
        this.message = 'Fehler beim Laden der Beiträge.';
      }
    });
  }

  likeTweet(tweetId: number): void {
    console.log(`Tweet ${tweetId} wurde geliked.`);
    const tweet = this.tweets.find(t => t.id === tweetId);
    if (tweet) {
      tweet.likes = (tweet.likes || 0) + 1;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
