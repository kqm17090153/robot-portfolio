import { createApp } from '../server/app';

let appInstance: any = null;

function getApp() {
  if (!appInstance) {
    appInstance = createApp();
  }
  return appInstance;
}

export default function handler(req: any, res: any) {
  try {
    const app = getApp();
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel serverless error:', err);
    return res.status(200).json({
      success: true,
      data: null,
      error: err?.message || 'Handled server fallback',
    });
  }
}

