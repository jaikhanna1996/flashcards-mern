import mongoose from 'mongoose';

export default async function mongooseConnect() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/flashcards';
    
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
