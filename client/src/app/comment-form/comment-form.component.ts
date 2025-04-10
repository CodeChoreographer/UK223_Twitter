import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comment-form.component.html'
})
export class CommentFormComponent {
  @Input() tweetId!: number;
  @Output() commentCreated = new EventEmitter<void>();

  content: string = '';

  constructor(
    private commentService: CommentService,
    private toastr: ToastrService
  ) {}

  submitComment(): void {
    if (!this.content.trim()) return;

    this.commentService.addComment(this.tweetId, this.content).subscribe({
      next: () => {
        this.toastr.success('Kommentar gepostet');
        this.content = '';
        this.commentCreated.emit();
      },
      error: () => this.toastr.error('Fehler beim Posten')
    });
  }
}
