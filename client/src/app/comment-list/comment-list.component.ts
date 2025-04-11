import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommentFormComponent,
  ]
})
export class CommentListComponent implements OnInit {
  @Input() tweetId!: number;
  @Input() currentUserId!: number;
  @Input() userRoles: string[] = [];


  comments: any[] = [];
  editingCommentId: number | null = null;
  editedContent: string = '';

  constructor(
    private commentService: CommentService,
    private toastr: ToastrService
  ) {}

  isOwnerOrModeratorOrAdmin(comment: any): boolean {
    return (
      comment.userId === this.currentUserId ||
      this.userRoles.includes('moderator') ||
      this.userRoles.includes('admin')
    );
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getComments(this.tweetId).subscribe({
      next: (data) => (this.comments = data),
      error: () => this.toastr.error('Fehler beim Laden der Kommentare')
    });
  }

  toggleLike(comment: any): void {
    const action = comment.likedByMe
      ? this.commentService.unlikeComment
      : this.commentService.likeComment;

    action.call(this.commentService, comment.id).subscribe({
      next: (res) => {
        comment.likedByMe = !comment.likedByMe;
        comment.likes += comment.likedByMe ? 1 : -1;
      },
      error: () => this.toastr.error('Fehler beim Liken')
    });
  }

  deleteComment(commentId: number): void {
    if (!confirm('Kommentar wirklich löschen?')) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c.id !== commentId);
        this.toastr.success('Kommentar gelöscht');
      },
      error: () => this.toastr.error('Fehler beim Löschen')
    });
  }

  startEdit(comment: any): void {
    this.editingCommentId = comment.id;
    this.editedContent = comment.content;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedContent = '';
  }

  saveEdit(comment: any): void {
    this.commentService.editComment(comment.id, this.editedContent).subscribe({
      next: () => {
        comment.content = this.editedContent;
        this.toastr.success('Kommentar aktualisiert');
        this.cancelEdit();
      },
      error: () => this.toastr.error('Fehler beim Bearbeiten')
    });
  }
}
