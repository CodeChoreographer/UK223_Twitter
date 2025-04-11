import { authenticateToken } from './authenticateToken';
import { requireAuth } from './requireAuth';
import { requireRole } from './requireRole';

import { UserController } from '../controllers/userController';
import { AdminController } from '../controllers/adminController';
import { TweetController } from '../controllers/tweetController';
import { CommentController } from '../controllers/commentController';
import { LikeController } from '../controllers/likeController';
import { requireTweetPermission } from './requireTweetPermission';
import { requireCommentPermission } from './requireCommentPermission';
import { requireProfilePermission } from './requireProfilePermission';


export class API {
  private app: Express;

  private userController: UserController;
  private adminController: AdminController;
  private tweetController: TweetController;
  private commentController: CommentController;
  private likeController: LikeController;

  constructor(app: Express) {
    this.app = app;

    this.userController = new UserController();
    this.adminController = new AdminController();
    this.tweetController = new TweetController();
    this.commentController = new CommentController();
    this.likeController = new LikeController();

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.use(authenticateToken);

    // USERS
    this.app.post('/api/users/register', this.userController.register.bind(this.userController));
    this.app.post('/api/users/login', this.userController.login.bind(this.userController));
    this.app.put(
      '/api/users/update',
      requireAuth,
      requireProfilePermission,
      this.userController.updateProfile.bind(this.userController)
    );

    // TWEETS
    this.app.get('/api/tweets', requireAuth, this.tweetController.getAllTweets.bind(this.tweetController));
    this.app.post('/api/tweets/create', requireAuth, requireRole('user', 'moderator', 'admin'), this.tweetController.createTweet.bind(this.tweetController));
    this.app.put('/api/tweets/edit', requireAuth, requireTweetPermission, this.tweetController.editTweet.bind(this.tweetController));
    this.app.delete('/api/tweets/delete/:id', requireAuth, requireTweetPermission, this.tweetController.deleteTweet.bind(this.tweetController));

    // COMMENTS
    this.app.post('/api/comments/add', requireAuth, this.commentController.addComment.bind(this.commentController));
    this.app.get('/api/comments/:tweetId', requireAuth, this.commentController.getComments.bind(this.commentController));
    this.app.put(
      '/api/comments/edit',
      requireAuth,
      requireCommentPermission,
      this.commentController.editComment.bind(this.commentController)
    );
    this.app.delete(
      '/api/comments/delete/:id',
      requireAuth,
      requireCommentPermission,
      this.commentController.deleteComment.bind(this.commentController)
    );

    // LIKES
    this.app.post('/api/likes/like', requireAuth, requireRole('user', 'moderator', 'admin'), this.likeController.likeTweet.bind(this.likeController));
    this.app.delete('/api/likes/unlike', requireAuth, requireRole('user', 'moderator', 'admin'), this.likeController.unlikeTweet.bind(this.likeController));
    this.app.post('/api/likes/comment/like', requireAuth, this.likeController.likeComment.bind(this.likeController));
    this.app.delete('/api/likes/comment/unlike', requireAuth, this.likeController.unlikeComment.bind(this.likeController));

    // ADMINSPACE
    this.app.get(
      '/api/admin/users',
      requireAuth,
      requireRole('admin'),
      this.adminController.getAllUsers.bind(this.adminController)
    );

    this.app.post(
      '/api/admin/users/:id/roles',
      requireAuth,
      requireRole('admin'),
      this.adminController.addRoleToUser.bind(this.adminController)
    );

    this.app.delete(
      '/api/admin/users/:id/roles/:roleId',
      requireAuth,
      requireRole('admin'),
      this.adminController.removeRoleFromUser.bind(this.adminController)
    );
    this.app.put(
      '/api/admin/users/:id/toggle-active',
      requireAuth,
      requireRole('admin'),
      this.adminController.toggleUserActive.bind(this.adminController)
    );
    this.app.delete(
      '/api/admin/users/:id',
      requireAuth,
      requireRole('admin'),
      this.adminController.deleteUser.bind(this.adminController)
    );




  }
}
