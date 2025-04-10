import { Response } from 'express';
import { AuthenticatedRequest } from '../api/authenticateToken';
import { Comment, User, Like } from '../database';

export class CommentController {
  async addComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    const { tweetId, content } = req.body;

    if (!userId || !tweetId || !content) {
      return res.status(400).json({ message: 'Fehlende Angaben' });
    }

    try {
      const comment = await Comment.create({ userId, tweetId, content });
      return res.status(201).json({ message: 'Kommentar hinzugefügt', comment });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Speichern', error });
    }
  }

  async getComments(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const tweetId = req.params.tweetId;
    const currentUserId = req.user?.userId;

    try {
      const comments = await Comment.findAll({
        where: { tweetId },
        include: [
          { model: User, attributes: ['id', 'username'] },
          { model: Like, attributes: ['userId'] }
        ],
        order: [['createdAt', 'ASC']]
      });

      const result = comments.map((comment: any) => {
        const likes = comment.Likes || [];
        const likedByMe = likes.some((l: any) => l.userId === currentUserId);

        return {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          userId: comment.userId,
          user: comment.User,
          likes: likes.length,
          likedByMe
        };
      });

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Laden der Kommentare', error });
    }
  }

  async editComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    const { id, content } = req.body;

    try {
      const comment = await Comment.findByPk(id);
      if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

      if (comment.userId !== userId) {
        return res.status(403).json({ message: 'Keine Berechtigung zum Bearbeiten' });
      }

      await Comment.update({ content }, { where: { id } });
      return res.status(200).json({ message: 'Kommentar bearbeitet' });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Bearbeiten', error });
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const commentId = req.params.id;
    const userId = req.user?.userId;

    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) return res.status(404).json({ message: 'Kommentar nicht gefunden' });

      if (comment.userId !== userId) {
        return res.status(403).json({ message: 'Keine Berechtigung zum Löschen' });
      }

      await comment.destroy();
      return res.status(200).json({ message: 'Kommentar gelöscht' });
    } catch (error) {
      return res.status(500).json({ message: 'Fehler beim Löschen', error });
    }
  }
}
