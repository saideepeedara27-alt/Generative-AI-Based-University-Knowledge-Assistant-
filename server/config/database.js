import mongoose from 'mongoose';

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.info('MongoDB is not configured. Chat history will not be saved.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.info('Connected to MongoDB.');
  } catch (error) {
    console.error('MongoDB connection failed. Continuing without saved chat history.', error.message);
  }
}
