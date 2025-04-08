export class Tweet {
  id: number;
  userId: number;
  content: string;

  constructor(id: number, userId: number, content: string) {
    this.id = id;
    this.userId = userId;
    this.content = content;
  }

  createTweet(): void {
    console.log('Tweet created.');
  }

  editTweet(): void {
    console.log('Tweet edited.');
  }

  deleteTweet(): void {
    console.log('Tweet deleted.');
  }
}
