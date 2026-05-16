import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://[::1]:8080';

async function proxyRequest(req: NextApiRequest, res: NextApiResponse, method: string, endpoint: string) {
  try {
    const authHeader = req.headers.authorization;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const url = `${BACKEND_URL}/api/v1${endpoint}`;
    
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => ({}));
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`Comments proxy error (${method} ${endpoint}):`, error);
    res.status(500).json({ error: { reason: 0, displayMessage: 'Failed to connect to backend' } });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return proxyRequest(req, res, 'POST', '/comments');
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
