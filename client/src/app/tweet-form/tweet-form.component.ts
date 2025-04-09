import { Component, EventEmitter, Output } from '@angular/core';
import { TweetService } from '../services/tweet.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tweet-form',
  standalone: true,
  templateUrl: './tweet-form.component.html',
  imports: [CommonModule, FormsModule],
})
export class TweetFormComponent {
  tweetText = '';

  @Output() tweetCreated = new EventEmitter<void>();

  constructor(private tweetService: TweetService, private toastr: ToastrService) {}

  submitTweet() {
    const content = this.tweetText.trim();
    if (!content) {
      this.toastr.error('Bitte gib einen Text ein.');
      return;
    }

    this.tweetService.createTweet(content).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Beitrag erfolgreich gepostet');
        this.tweetText = '';
        this.tweetCreated.emit();
      },
      error: () => {
        this.toastr.error('Fehler beim Posten des Beitrags');
      },
    });
  }
}
