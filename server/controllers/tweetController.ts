import { Response } from 'express';
import { AuthenticatedRequest } from '../api/authenticateToken';
import { Tweet, User, Like } from '../database';

export class TweetController {
  async createTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId || !content) {
      return res.status(400).json({ message: 'Invalide Anfrage: userId oder Inhalt fehlt' });
    }

    try {
      const tweet = await Tweet.create({ userId, content });
      return res.status(201).json({ message: 'Beitrag erfolgreich gepostet', tweet });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Erstellen des Beitrags', error });
    }
  }

  async getAllTweets(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const currentUserId = req.user?.userId;

    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Laden der Beiträge', error });
    }
  }

  async editTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id, content } = req.body;

    if (!id || !content) {
      return res.status(400).json({ message: 'Tweet-ID oder Inhalt fehlt' });
    }

    try {
      const tweet = await Tweet.findByPk(id);
      if (!tweet) {
        return res.status(404).json({ message: 'Tweet nicht gefunden' });
      }

      await tweet.update({ content });

      return res.status(200).json({ message: 'Beitrag erfolgreich bearbeitet' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Bearbeiten des Beitrags', error });
    }
  }

  async deleteTweet(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Ungültige Tweet-ID' });
    }

    try {
      const tweet = await Tweet.findByPk(id);
      if (!tweet) {
        return res.status(404).json({ message: 'Tweet nicht gefunden' });
      }

      await tweet.destroy();

      return res.status(200).json({ message: 'Beitrag erfolgreich gelöscht' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Löschen des Beitrags', error });
    }
  }
}
