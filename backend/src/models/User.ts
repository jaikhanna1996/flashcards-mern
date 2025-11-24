import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
  }
);

// Pre-save hook: runs automatically BEFORE saving a document
userSchema.pre('save', async function (next) {
  // 'this' refers to the document being saved
  if (!this.isModified('password')) {
    return next(); // Skip hashing, continue with save
  }

  // Hash the password using bcrypt
  // genSalt(12) creates a salt with 12 rounds (higher = more secure but slower)
  const salt = await bcrypt.genSalt(12);
  
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

(userSchema.methods as any).comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;

