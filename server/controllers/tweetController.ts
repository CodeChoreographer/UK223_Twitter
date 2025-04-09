import { Request, Response } from 'express';
import { Tweet } from '../database';

export class TweetController {
  async createTweet(req: Request, res: Response): Promise<void> {
    const { userId, content } = req.body;

    try {
      const tweet = await Tweet.create({ userId, content });
      res.status(201).json({ message: 'Tweet created successfully', tweet });
    } catch (error) {
      res.status(500).json({ message: 'Error creating tweet', error });
    }
  }

  async getAllTweets(req: Request, res: Response): Promise<void> {
    try {
      const tweets = await Tweet.findAll(); // Sequelize-Methode
      res.status(200).json(tweets);
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Laden der Tweets', error });
    }
  }

  async editTweet(req: Request, res: Response): Promise<void> {
    const { id, content } = req.body;

    try {
      await Tweet.update({ content }, { where: { id } });
      res.status(200).json({ message: 'Tweet updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating tweet', error });
    }
  }

  async deleteTweet(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await Tweet.destroy({ where: { id } });
      res.status(200).json({ message: 'Tweet deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tweet', error });
    }
  }
}
