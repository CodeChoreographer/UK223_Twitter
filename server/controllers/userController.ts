import { Request, Response } from 'express';
import { User, Role, UserRole } from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { RoleInstance, UserInstance } from '../types/modelTypes'

dotenv.config();

export class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) throw { status: 400, message: 'Benutzername existiert bereits' };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword }) as UserInstance;

    const userRole = await Role.findOne({ where: { name: 'user' } }) as RoleInstance;
    if (!userRole) throw { status: 500, message: 'Standardrolle nicht gefunden' };

    await UserRole.create({ userId: newUser.id, roleId: userRole.id });

    return res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) throw { status: 401, message: 'Benutzer nicht gefunden' };
    if (!user.getDataValue('isActive')) throw { status: 403, message: 'Benutzerkonto ist gesperrt' };

    const isPasswordValid = await bcrypt.compare(password, user.getDataValue('password'));
    if (!isPasswordValid) throw { status: 401, message: 'Falsches Passwort' };

    const roles = await UserRole.findAll({
      where: { userId: user.getDataValue('id') },
      include: [{ model: Role }]
    });

    const roleNames = roles.map(r => (r as any).Role?.name ?? 'user');

    const token = jwt.sign(
      {
        userId: user.getDataValue('id'),
        username: user.getDataValue('username'),
        roles: roleNames,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Login erfolgreich',
      token
    });
  }

  async updateProfile(req: Request, res: Response): Promise<Response> {
    const { userId, username, password } = req.body;

    if (!userId || !username || !password) {
      throw { status: 400, message: 'Fehlende Felder' };
    }

    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'Benutzer nicht gefunden' };

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ username, password: hashedPassword });

    return res.status(200).json({ message: 'Profil erfolgreich aktualisiert' });
  }
}
