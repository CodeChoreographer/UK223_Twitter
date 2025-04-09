import { Request, Response, Express } from 'express';
import { UserController } from '../controllers/userController';
import { TweetController } from '../controllers/tweetController';
import { CommentController } from '../controllers/commentController';
import { LikeController } from '../controllers/likeController';
import { NotificationController } from '../controllers/notificationController';

export class API {
  private app: Express;

  private userController = new UserController();
  private tweetController = new TweetController();
  private commentController = new CommentController();
  private likeController = new LikeController();
  private notificationController = new NotificationController();

  constructor(app: Express) {
    this.app = app;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // User-Routes
    this.app.post('/api/users/register', this.userController.register.bind(this.userController));
    this.app.post('/api/users/login', this.userController.login.bind(this.userController));
    this.app.put('/api/users/update', this.userController.updateProfile.bind(this.userController));

    // Tweet-Routes
    this.app.post('/api/tweets/create', this.tweetController.createTweet.bind(this.tweetController));
    this.app.get('/api/tweets', this.tweetController.getAllTweets.bind(this.tweetController));
    this.app.put('/api/tweets/edit', this.tweetController.editTweet.bind(this.tweetController));
    this.app.delete('/api/tweets/delete/:id', this.tweetController.deleteTweet.bind(this.tweetController));

    // Comment-Routes
    this.app.post('/api/comments/add', this.commentController.addComment.bind(this.commentController));
    this.app.delete('/api/comments/delete/:id', this.commentController.deleteComment.bind(this.commentController));

    // Like-Routes
    this.app.post('/api/likes/like', this.likeController.likeTweet.bind(this.likeController));
    this.app.delete('/api/likes/unlike/:id', this.likeController.unlikeTweet.bind(this.likeController));

    // Notification-Routes
    this.app.post('/api/notifications/send', this.notificationController.sendNotification.bind(this.notificationController));
    this.app.put('/api/notifications/mark-as-read/:id', this.notificationController.markAsRead.bind(this.notificationController));
  }
}
