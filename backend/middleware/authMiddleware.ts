import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin.js';

interface AuthRequest extends Request {
  admin?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    req.admin = { id: admin._id, email: admin.email, role: admin.role };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
