import { authenticateToken } from './authenticateToken';
import { requireAuth } from './requireAuth';
import { requireRole } from './requireRole';

import { UserController } from '../controllers/userController';
import { TweetController } from '../controllers/tweetController';
import { CommentController } from '../controllers/commentController';
import { LikeController } from '../controllers/likeController';
import { NotificationController } from '../controllers/notificationController';

export class API {
  private app: Express;

  private userController: UserController;
  private tweetController: TweetController;
  private commentController: CommentController;
  private likeController: LikeController;
  private notificationController: NotificationController;

  constructor(app: Express) {
    this.app = app;

    this.userController = new UserController();
    this.tweetController = new TweetController();
    this.commentController = new CommentController();
    this.likeController = new LikeController();
    this.notificationController = new NotificationController();

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.use(authenticateToken);

    this.app.post('/api/users/register', this.userController.register.bind(this.userController));
    this.app.post('/api/users/login', this.userController.login.bind(this.userController));

    this.app.get('/api/tweets', requireAuth, this.tweetController.getAllTweets.bind(this.tweetController));
    this.app.post('/api/tweets/create', requireAuth, requireRole('user', 'moderator', 'admin'), this.tweetController.createTweet.bind(this.tweetController));
    this.app.put('/api/tweets/edit', requireAuth, requireRole('user','moderator', 'admin'), this.tweetController.editTweet.bind(this.tweetController));
    this.app.delete('/api/tweets/delete/:id', requireAuth, requireRole('user','admin'), this.tweetController.deleteTweet.bind(this.tweetController));

    this.app.post('/api/comments/add', requireAuth, this.commentController.addComment.bind(this.commentController));
    this.app.get('/api/comments/:tweetId', requireAuth, this.commentController.getComments.bind(this.commentController));
    this.app.put('/api/comments/edit', requireAuth, this.commentController.editComment.bind(this.commentController));
    this.app.delete('/api/comments/delete/:id', requireAuth, this.commentController.deleteComment.bind(this.commentController));

    this.app.post('/api/likes/like', requireAuth, requireRole('user', 'moderator', 'admin'), this.likeController.likeTweet.bind(this.likeController));
    this.app.delete('/api/likes/unlike', requireAuth, requireRole('user', 'moderator', 'admin'), this.likeController.unlikeTweet.bind(this.likeController));
    this.app.post('/api/likes/comment/like', requireAuth, this.likeController.likeComment.bind(this.likeController));
    this.app.delete('/api/likes/comment/unlike', requireAuth, this.likeController.unlikeComment.bind(this.likeController));

    this.app.post('/api/notifications/send', requireAuth, requireRole('admin'), this.notificationController.sendNotification.bind(this.notificationController));
    this.app.put('/api/notifications/mark-as-read/:id', requireAuth, this.notificationController.markAsRead.bind(this.notificationController));
  }
}
