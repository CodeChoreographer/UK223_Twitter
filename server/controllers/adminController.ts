import { Response } from 'express';
import { AuthenticatedRequest } from '../api/authenticateToken';
import { User, Role, UserRole } from '../database';
import { RoleInstance } from '../types/modelTypes';


export class AdminController {
  async getAllUsers(_req: AuthenticatedRequest, res: Response): Promise<Response> {
    const users = await User.findAll({
      attributes: ['id', 'username', 'isActive'],
      include: [{ model: Role, attributes: ['id', 'name'], through: { attributes: [] } }],
      order: [['username', 'ASC']]
    });

    return res.status(200).json(users);
  }

  async addRoleToUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    const { roleName } = req.body;

    if (!userId || !roleName) {
      throw { status: 400, message: 'Benutzer-ID oder Rollenname fehlt' };
    }

    const role = await Role.findOne({ where: { name: roleName } }) as RoleInstance;
    if (!role) throw { status: 404, message: 'Rolle nicht gefunden' };

    await UserRole.findOrCreate({
      where: { userId, roleId: role.id }
    });

    return res.status(200).json({ message: `Rolle ${roleName} hinzugefügt` });
  }

  async removeRoleFromUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    const roleId = parseInt(req.params.roleId);

    if (!userId || !roleId) {
      throw { status: 400, message: 'Benutzer-ID oder Rollen-ID fehlt' };
    }

    await UserRole.destroy({
      where: { userId, roleId }
    });

    return res.status(200).json({ message: 'Rolle entfernt' });
  }

  async toggleUserActive(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    if (!userId || isNaN(userId)) {
      throw { status: 400, message: 'Ungültige Benutzer-ID' };
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw { status: 404, message: 'Benutzer nicht gefunden' };
    }

    const updated = !user.getDataValue('isActive');
    await user.update({ isActive: updated });

    return res.status(200).json({
      message: updated ? 'Benutzerkonto freigegeben' : 'Benutzerkonto gesperrt',
      isActive: updated
    });
  }

  async deleteUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id);
    if (!userId || isNaN(userId)) {
      throw { status: 400, message: 'Ungültige Benutzer-ID' };
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw { status: 404, message: 'Benutzer nicht gefunden' };
    }

    await user.destroy();

    return res.status(200).json({ message: 'Benutzerkonto gelöscht' });
  }
}
