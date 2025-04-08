import { Request, Response, Express } from 'express'
import { UserController } from '../controllers/userController'
import { TweetController } from '../controllers/tweetController'
import { CommentController } from '../controllers/commentController'
import { LikeController } from '../controllers/likeController'
import { NotificationController } from '../controllers/notificationController'

export class API {
  // Properties
  app: Express
  private userController: UserController
  private tweetController: TweetController
  private commentController: CommentController
  private likeController: LikeController
  private notificationController: NotificationController

  // Constructor
  constructor(app: Express) {
    this.app = app

    // Controller Instances
    this.userController = new UserController()
    this.tweetController = new TweetController()
    this.commentController = new CommentController()
    this.likeController = new LikeController()
    this.notificationController = new NotificationController()

    // Routen einrichten
    this.setupRoutes()
  }

  // methodes
  private setupRoutes(): void {
    // testroute
    this.app.get('/hello', this.sayHello)

    // User-Routes
    this.app.post('/api/users/register', (req, res) => this.userController.register(req, res))
    this.app.post('/api/users/login', (req, res) => this.userController.login(req, res))
    this.app.put('/api/users/update', (req, res) => this.userController.updateProfile(req, res))

    // Tweet-Routes
    this.app.post('/api/tweets/create', (req, res) => this.tweetController.createTweet(req, res))
    this.app.put('/api/tweets/edit', (req, res) => this.tweetController.editTweet(req, res))
    this.app.delete('/api/tweets/delete/:id', (req, res) => this.tweetController.deleteTweet(req, res))

    // Comment-Routes
    this.app.post('/api/comments/add', (req, res) => this.commentController.addComment(req, res))
    this.app.delete('/api/comments/delete/:id', (req, res) => this.commentController.deleteComment(req, res))

    // Like-Routes
    this.app.post('/api/likes/like', (req, res) => this.likeController.likeTweet(req, res))
    this.app.delete('/api/likes/unlike/:id', (req, res) => this.likeController.unlikeTweet(req, res))

    // Notification-Routes
    this.app.post('/api/notifications/send', (req, res) => this.notificationController.sendNotification(req, res))
    this.app.put('/api/notifications/mark-as-read/:id', (req, res) => this.notificationController.markAsRead(req, res))
  }

  private sayHello(req: Request, res: Response) {
    res.send('Hello There!')
  }
}
