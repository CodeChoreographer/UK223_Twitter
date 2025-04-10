import { Component, OnInit } from '@angular/core';
import { TweetService } from '../services/tweet.service';
import { ToastrService } from 'ngx-toastr';
import { TweetFormComponent } from '../tweet-form/tweet-form.component';
import { TweetListComponent } from '../tweet-list/tweet-list.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTweetDialogComponent } from '../edit-tweet-dialog/edit-tweet-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    TweetFormComponent,
    TweetListComponent,
  ]
})
export class DashboardComponent implements OnInit {
  tweets: any[] = [];
  currentUserId: number | null = null;

  constructor(
    private tweetService: TweetService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.tweetService.getCurrentUserId();
    this.reloadTweets();
  }

  reloadTweets(): void {
    this.tweetService.getTweets().subscribe({
      next: (data) => {
        this.tweets = data;
      },
      error: () => this.toastr.error('Fehler beim Laden der Beiträge'),
    });
  }

  toggleLike(tweet: any): void {
    if (tweet.likedByMe) {
      this.tweetService.unlikeTweet(tweet.id).subscribe({
        next: (res) => {
          if (res.liked === false) {
            tweet.likedByMe = false;
            tweet.likes = Math.max(0, tweet.likes - 1);
            this.toastr.success(res.message);
          }
        },
        error: () => this.toastr.error('Fehler beim Disliken'),
      });
    } else {
      this.tweetService.likeTweet(tweet.id).subscribe({
        next: (res) => {
          if (res.liked === true) {
            tweet.likedByMe = true;
            tweet.likes += 1;
            this.toastr.success(res.message);
          } else {
            this.toastr.info('Du hast diesen Beitrag bereits geliked.');
          }
        },
        error: () => this.toastr.error('Fehler beim Liken'),
      });
    }
  }

  editTweet(tweet: any): void {
    const dialogRef = this.dialog.open(EditTweetDialogComponent, {
      data: { tweet },
    });

    dialogRef.afterClosed().subscribe((updatedTweet) => {
      if (updatedTweet) {
        const index = this.tweets.findIndex((t) => t.id === updatedTweet.id);
        if (index > -1) {
          this.tweets[index].content = updatedTweet.content;
          this.toastr.success('Beitrag aktualisiert');
        }
      }
    });
  }

  deleteTweet(id: number): void {
    if (confirm('Willst du diesen Beitrag wirklich löschen?')) {
      this.tweetService.deleteTweet(id).subscribe({
        next: () => {
          this.toastr.success('Beitrag gelöscht');
          this.tweets = this.tweets.filter((t) => t.id !== id);
        },
        error: () => this.toastr.error('Fehler beim Löschen'),
      });
    }
  }

  editProfile(): void {
    this.toastr.info('Profilbearbeitung noch nicht implementiert.');
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
