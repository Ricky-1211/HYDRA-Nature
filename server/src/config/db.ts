import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    console.log(`Connecting to MongoDB at: ${env.MONGODB_URI}...`);
    
    // Attempt connecting to configured MongoDB
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('MongoDB successfully connected!');
  } catch (error) {
    console.warn('Initial MongoDB connection failed. Attempting in-memory MongoDB fallback for smooth local testing...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.log(`In-memory MongoDB started at: ${uri}`);
      await mongoose.connect(uri);
      console.log('Connected to In-Memory MongoDB successfully!');
    } catch (fallbackError) {
      console.error('All MongoDB connection attempts failed:', error);
      throw error;
    }
  }
};
