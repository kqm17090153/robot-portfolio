import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  findUserByUsername,
  getPublicPortfolio,
  updatePortfolioData,
  resetPortfolioToDefault,
  FullPortfolioData,
} from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'robotfolio-secret-key-2026-wro-admin-token';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));
  app.use(cookieParser());

  // Helper Auth Middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    let token = '';
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      res.status(401).json({ error: '인증이 필요합니다. 로그인해 주세요.' });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        username: string;
        role: string;
        name: string;
      };
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ error: '유효하지 않거나 만료된 세션입니다.' });
      return;
    }
  };

  // -------------------------------------------------------------
  // Health & Ping
  // -------------------------------------------------------------
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // -------------------------------------------------------------
  // Public Portfolio API (Anyone can view)
  // -------------------------------------------------------------
  app.get('/api/portfolio', (req: Request, res: Response) => {
    try {
      const data = getPublicPortfolio();
      res.json({ success: true, data });
    } catch (error: any) {
      console.error('Error getting portfolio:', error);
      res.status(500).json({ error: '포트폴리오 데이터를 불러오지 못했습니다.' });
    }
  });

  // -------------------------------------------------------------
  // Auth API
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response): void => {
    try {
      const { username, password } = req.body || {};

      if (!username || !password) {
        res.status(400).json({ error: '아이디와 비밀번호를 모두 입력해 주세요.' });
        return;
      }

      const user = findUserByUsername(username);
      if (!user) {
        res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        return;
      }

      // Secure bcrypt hash verification
      const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        return;
      }

      // Generate JWT Token (Valid for 7 days)
      const tokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

      // Set secure cookie
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: '성공적으로 로그인되었습니다.',
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: '로그인 처리 중 서버 오류가 발생했습니다.' });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({
      success: true,
      user,
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie('admin_token');
    res.json({ success: true, message: '성공적으로 로그아웃되었습니다.' });
  });

  // -------------------------------------------------------------
  // Protected Admin Portfolio Operations (Authenticated Admin Only)
  // -------------------------------------------------------------
  app.put('/api/portfolio', authenticateToken, (req: Request, res: Response) => {
    try {
      const payload = req.body as Partial<FullPortfolioData>;
      const updated = updatePortfolioData(payload);
      res.json({
        success: true,
        message: '포트폴리오가 성공적으로 저장 및 공개 반영되었습니다.',
        data: updated,
      });
    } catch (error: any) {
      console.error('Error updating portfolio:', error);
      res.status(500).json({ error: '포트폴리오 저장 중 오류가 발생했습니다.' });
    }
  });

  app.post('/api/portfolio/reset', authenticateToken, (req: Request, res: Response) => {
    try {
      const reset = resetPortfolioToDefault();
      res.json({
        success: true,
        message: '포트폴리오가 기본 데이터로 초기화되었습니다.',
        data: reset,
      });
    } catch (error: any) {
      console.error('Error resetting portfolio:', error);
      res.status(500).json({ error: '초기화 중 오류가 발생했습니다.' });
    }
  });

  return app;
}
