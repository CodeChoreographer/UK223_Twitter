export class Comment {
  id: number;
  userId: number;
  tweetId: number;
  content: string;

  constructor(id: number, userId: number, tweetId: number, content: string) {
    this.id = id;
    this.userId = userId;
    this.tweetId = tweetId;
    this.content = content;
  }

  addComment(): void {
    console.log('Comment added.');
  }

  editComment(): void {
    console.log('Comment edited.');
  }

  deleteComment(): void {
    console.log('Comment deleted.');
  }
}
