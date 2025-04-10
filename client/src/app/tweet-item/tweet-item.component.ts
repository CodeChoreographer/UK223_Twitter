import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { CommentListComponent } from '../comment-list/comment-list.component'

@Component({
  selector: 'app-tweet-item',
  standalone: true,
  templateUrl: './tweet-item.component.html',
  imports: [CommonModule, CommentListComponent],
})
export class TweetItemComponent {
  @Input() tweet!: any;
  @Input() currentUserId!: number;


  @Output() likeClicked = new EventEmitter<any>()
  @Output() editClicked = new EventEmitter<any>()
  @Output() deleteClicked = new EventEmitter<number>()

  handleLike(): void {
    this.likeClicked.emit(this.tweet)
  }

  handleEdit(): void {
    this.editClicked.emit(this.tweet)
  }

  handleDelete(): void {
    this.deleteClicked.emit(this.tweet.id)
  }

  getRelativeTime(date: string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: de })
  }
}
