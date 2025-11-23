import { Request } from 'express';
import { IUser } from './user.interface';

// Extend Express Request type to include user property
// This tells TypeScript that req.user exists and is of type IUser
export interface AuthRequest extends Request {
  user?: IUser;
}

