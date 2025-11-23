import mongoose, { Document } from 'mongoose';

// Interface defines the structure/shape of User data
// Extends Document means it's a Mongoose document (has _id, save(), etc.)
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

