import { Request, Response } from 'express';
import { User } from '../database';

export class UserController {

  async register(req: Request, res: Response): Promise<void> {
    const { username, password, role } = req.body;

    try {
      const newUser = await User.create({ username, password, role });
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username, password } });

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }
}
