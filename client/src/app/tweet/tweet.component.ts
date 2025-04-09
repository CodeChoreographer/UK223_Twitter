import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  tweetText = '';
  message = '';

  submitTweet() {
    this.message = 'Beitrag erfolgreich erstellt!';
    this.tweetText = '';
  }
}
