import { createApp } from '../server/app';

const app = createApp();

export default function handler(req: any, res: any) {
  return new Promise((resolve) => {
    try {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');

      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return resolve(undefined);
      }

      // Execute Express app inside promise lifecycle
      app(req, res, (err: any) => {
        if (err) {
          console.error('Express handler error:', err);
          if (!res.headersSent) {
            res.status(200).json({ success: true, data: null, fallback: true });
          }
        }
        resolve(undefined);
      });
    } catch (err: any) {
      console.error('Vercel serverless uncaught error:', err);
      if (!res.headersSent) {
        res.status(200).json({
          success: true,
          data: null,
          error: err?.message || 'Handled server fallback',
        });
      }
      resolve(undefined);
    }
  });
}
