import { Request, Response } from 'express'
import { User, Role, UserRole } from '../database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class UserController {
  async register(req: Request, res: Response) {
    const { username, password } = req.body

    try {
      const existingUser = await User.findOne({ where: { username } })
      if (existingUser) return res.status(400).json({ message: 'Benutzername existiert bereits' })

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await User.create({ username, password: hashedPassword })

      const userRole = await Role.findOne({ where: { name: 'user' } })
      if (!userRole) return res.status(500).json({ message: 'Standardrolle nicht gefunden' })

      await UserRole.create({ userId: newUser.getDataValue('id'), roleId: userRole.getDataValue('id') })

      return res.status(201).json({ message: 'Benutzer erfolgreich registriert' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Fehler bei der Registrierung' })
    }
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body

    try {
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return res.status(401).json({ message: 'Benutzer nicht gefunden' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.getDataValue('password'))
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Falsches Passwort' })
      }

      const roles = await UserRole.findAll({
        where: { userId: user.getDataValue('id') },
        include: [{ model: Role }]
      })

      const roleNames = roles.map(r => (r as any).Role?.name ?? 'user')

      const token = jwt.sign(
        {
          userId: user.getDataValue('id'),
          username: user.getDataValue('username'),
          roles: roleNames,
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      )

      return res.status(200).json({
        message: 'Login erfolgreich',
        token
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Login fehlgeschlagen' })
    }
  }

  async updateProfile(req: Request, res: Response) { }
}
