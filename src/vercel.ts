/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createApp } from './main';
import type { Request, Response } from 'express';
import type { Express } from 'express';

let cachedApp: Express | null = null;

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!cachedApp) {
    const app = await createApp();
    cachedApp = app.getHttpAdapter().getInstance();
  }

  return cachedApp(req, res);
}
