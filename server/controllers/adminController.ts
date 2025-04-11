import { Response } from 'express';
import { AuthenticatedRequest } from '../api/authenticateToken';
import { User, Role, UserRole } from '../database';

export class AdminController {
  async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'isActive'],
        include: [{ model: Role, attributes: ['id', 'name'], through: { attributes: [] } }],
        order: [['username', 'ASC']]
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Laden der Benutzer', error });
    }
  }

  async addRoleToUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    const { roleName } = req.body;

    if (!userId || !roleName) {
      return res.status(400).json({ message: 'Benutzer-ID oder Rollenname fehlt' });
    }

    try {
      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) return res.status(404).json({ message: 'Rolle nicht gefunden' });

      await UserRole.findOrCreate({
        where: { userId, roleId: role.id }
      });

      return res.status(200).json({ message: `Rolle ${roleName} hinzugefügt` });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Hinzufügen der Rolle', error });
    }
  }

  async removeRoleFromUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    const roleId = parseInt(req.params.roleId);

    if (!userId || !roleId) {
      return res.status(400).json({ message: 'Benutzer-ID oder Rollen-ID fehlt' });
    }

    try {
      await UserRole.destroy({
        where: { userId, roleId }
      });

      return res.status(200).json({ message: `Rolle entfernt` });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Entfernen der Rolle', error });
    }
  }

  async toggleUserActive(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Ungültige Benutzer-ID' });
    }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Benutzer nicht gefunden' });
      }

      const updated = !user.getDataValue('isActive');
      await user.update({ isActive: updated });

      return res.status(200).json({
        message: updated ? 'Benutzerkonto freigegeben' : 'Benutzerkonto gesperrt',
        isActive: updated
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Ändern des Benutzerstatus', error });
    }
  }
  async deleteUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Ungültige Benutzer-ID' });
    }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Benutzer nicht gefunden' });
      }

      await user.destroy();

      return res.status(200).json({ message: 'Benutzerkonto gelöscht' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Löschen des Benutzers', error });
    }
  }


}
