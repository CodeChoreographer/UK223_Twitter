import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetComponent } from '../tweet/tweet.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, TweetComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {}
