import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TweetService } from '../services/tweet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-tweet-dialog',
  standalone: true,
  templateUrl: './edit-tweet-dialog.component.html',
  imports: [CommonModule, FormsModule],
})
export class EditTweetDialogComponent {
  editedContent: string;

  constructor(
    private dialogRef: MatDialogRef<EditTweetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tweetService: TweetService
  ) {
    this.editedContent = data.tweet.content;
  }

  updateTweet() {
    this.tweetService.editTweet(this.data.tweet.id, this.editedContent).subscribe({
      next: (res) => {
        this.dialogRef.close({ ...this.data.tweet, content: this.editedContent });
      },
      error: () => {
        alert('Fehler beim Bearbeiten des Beitrags');
      },
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
