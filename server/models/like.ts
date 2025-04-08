export class Like {
  id: number;
  userId: number;
  tweetId: number;

  constructor(id: number, userId: number, tweetId: number) {
    this.id = id;
    this.userId = userId;
    this.tweetId = tweetId;
  }

  likeTweet(): void {
    console.log('Tweet liked.');
  }

  unlikeTweet(): void {
    console.log('Like removed.');
  }
}
