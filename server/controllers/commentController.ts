import { Response } from 'express';
import { AuthenticatedRequest } from '../api/authenticateToken';
import { Comment, User, Like } from '../database';

export class CommentController {
  async addComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    const { tweetId, content } = req.body;

    if (!userId || !tweetId || !content) {
      throw { status: 400, message: 'Fehlende Angaben' };
    }

    const comment = await Comment.create({ userId, tweetId, content });
    return res.status(201).json({ message: 'Kommentar hinzugefügt', comment });
  }

  async getComments(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const tweetId = req.params.tweetId;
    const currentUserId = req.user?.userId;

    const comments = await Comment.findAll({
      where: { tweetId },
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Like, attributes: ['userId'] }
      ],
      order: [['createdAt', 'DESC']]
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
  }

  async editComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id, content } = req.body;

    if (!id || !content) {
      throw { status: 400, message: 'ID oder Inhalt fehlt' };
    }

    const comment = await Comment.findByPk(id);
    if (!comment) throw { status: 404, message: 'Kommentar nicht gefunden' };

    await comment.update({ content });
    return res.status(200).json({ message: 'Kommentar bearbeitet' });
  }

  async deleteComment(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const commentId = req.params.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw { status: 404, message: 'Kommentar nicht gefunden' };

    await comment.destroy();
    return res.status(200).json({ message: 'Kommentar gelöscht' });
  }
}
