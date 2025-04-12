import { Response } from 'express';
import { AuthenticatedRequest } from '../api/authenticateToken';
import { Tweet, User, Like } from '../database';

export class TweetController {
  async createTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId || !content) {
      throw { status: 400, message: 'Invalide Anfrage: userId oder Inhalt fehlt' };
    }

    const tweet = await Tweet.create({ userId, content });
    return res.status(201).json({ message: 'Beitrag erfolgreich gepostet', tweet });
  }

  async getAllTweets(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const currentUserId = req.user?.userId;

    const tweets = await Tweet.findAll({
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Like, attributes: ['userId'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const result = tweets.map((tweet: any) => {
      const likes = tweet.Likes || [];
      const likedByMe = likes.some((like: any) => like.userId === currentUserId);

      return {
        id: tweet.id,
        content: tweet.content,
        createdAt: tweet.createdAt,
        userId: tweet.userId,
        user: tweet.User,
        likes: likes.length,
        likedByMe
      };
    });

    return res.status(200).json(result);
  }

  async editTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id, content } = req.body;

    if (!id || !content) {
      throw { status: 400, message: 'Tweet-ID oder Inhalt fehlt' };
    }

    const tweet = await Tweet.findByPk(id);
    if (!tweet) throw { status: 404, message: 'Tweet nicht gefunden' };

    await tweet.update({ content });

    return res.status(200).json({ message: 'Beitrag erfolgreich bearbeitet' });
  }

  async deleteTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
      throw { status: 400, message: 'Ungültige Tweet-ID' };
    }

    const tweet = await Tweet.findByPk(id);
    if (!tweet) throw { status: 404, message: 'Tweet nicht gefunden' };

    await tweet.destroy();

    return res.status(200).json({ message: 'Beitrag erfolgreich gelöscht' });
  }
}
