import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetItemComponent } from '../tweet-item/tweet-item.component'

@Component({
  selector: 'app-tweet-list',
  standalone: true,
  templateUrl: './tweet-list.component.html',
  imports: [CommonModule, TweetItemComponent],
})
export class TweetListComponent {
  @Input() tweets: any[] = [];
  @Input() currentUserId!: number;

  @Output() toggleLike = new EventEmitter<any>();

  handleLike(tweet: any): void {
    this.toggleLike.emit(tweet);
  }
  @Output() editTweet = new EventEmitter<any>();
  @Output() deleteTweet = new EventEmitter<number>();

  handleEdit(tweet: any): void {
    this.editTweet.emit(tweet);
  }

  handleDelete(id: number): void {
    this.deleteTweet.emit(id);
  }

}
