import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const dbCheck = (req: Request, res: Response, next: NextFunction) => {
  console.log('[dbCheck] Diagnostic info:');
  console.log('  - mongoose.connection.readyState:', mongoose.connection.readyState);
  console.log('  - mongoose.connections length:', mongoose.connections.length);
  if (mongoose.connections.length > 0) {
    console.log('  - connection[0] state:', mongoose.connections[0].readyState);
    console.log('  - connection[0] host:', mongoose.connections[0].host);
    console.log('  - connection[0] db name:', mongoose.connections[0].name);
  }

  // Check if MongoDB is connected before processing data requests
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not available. Please try again later.',
      readyState: mongoose.connection.readyState,
      connectionsCount: mongoose.connections.length,
      firstConnectionState: mongoose.connections.length > 0 ? mongoose.connections[0].readyState : null,
    });
  }
  next();
};

export default dbCheck;
