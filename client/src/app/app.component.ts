import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TweetComponent } from './tweet/tweet.component';
import { FeedComponent } from './feed/feed.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
}
