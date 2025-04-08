import { User } from '../models/User';
import { Database } from '../database/database';
import { Request, Response } from 'express';

export class UserController {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  async register(req: Request, res: Response): Promise<void> {
    const { name, password } = req.body;
    const user = new User(0, name, password);
    // logic for database
    res.status(201).json({ message: 'User registered successfully.' });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { name, password } = req.body;
    // authentification logic
    res.status(200).json({ message: 'User logged in successfully.' });
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const { id, name, password } = req.body;
    // profile safe and update
    res.status(200).json({ message: 'Profile updated successfully.' });
  }
}
