import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    mongoose.connection.on('connected', () => {
      console.log(`[${new Date().toISOString()}] Mongoose default connection open`);
    });
    mongoose.connection.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] Mongoose default connection error:`, err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log(`[${new Date().toISOString()}] Mongoose default connection disconnected`);
    });

    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      family: 4, // Force IPv4 to prevent issues on networks with incomplete IPv6 support
    });

    console.log(`[${new Date().toISOString()}] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes('SSL alert number 80') || error.message.includes('tlsv1 alert internal error') || error.message.includes('MongoServerSelectionError')) {
      console.warn(`
========================================================================
⚠️  CONNECTION FAILED: POTENTIAL IP WHITELIST OR SSL HANDSHAKE ISSUE ⚠️
------------------------------------------------------------------------
It looks like MongoDB Atlas rejected your connection request.
To fix this:
1. Log in to MongoDB Atlas: https://cloud.mongodb.com
2. Go to "Network Access" in the left sidebar.
3. Click "Add IP Address" and select "Add Current IP Address".
4. If you are on a dynamic IP or VPN, try temporarily adding "0.0.0.0/0"
   (Allow access from anywhere) to test if that resolves the issue.
========================================================================
      `);
    }
    throw error;
  }
};

export default connectDB;
