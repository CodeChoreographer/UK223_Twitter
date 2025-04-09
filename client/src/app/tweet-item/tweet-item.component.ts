import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

@Component({
  selector: 'app-tweet-item',
  standalone: true,
  templateUrl: './tweet-item.component.html',
  imports: [CommonModule],
})
export class TweetItemComponent {
  @Input() tweet: any;
  @Input() currentUserId: number | null = null;

  @Output() likeClicked = new EventEmitter<any>();
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<number>();

  handleLike(): void {
    this.likeClicked.emit(this.tweet);
  }

  handleEdit(): void {
    this.editClicked.emit(this.tweet);
  }

  handleDelete(): void {
    this.deleteClicked.emit(this.tweet.id);
  }

  getRelativeTime(date: string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: de });
  }
}
