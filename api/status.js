import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST — update status (requires auth)
  if (req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const expected = process.env.SHADOW_API_TOKEN;
    if (!expected || token !== expected) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const body = req.body;
    const current = (await kv.get('shadow-status')) || {};
    const updated = { ...current, ...body, updatedAt: Date.now() };
    await kv.set('shadow-status', updated);
    return res.status(200).json({ ok: true });
  }

  // GET — read status
  const data = await kv.get('shadow-status');
  if (!data) {
    return res.status(200).json({
      status: 'idle',
      currentTask: 'Waiting for work...',
      subAgents: [],
      stats: { prs: 28, tests: 340, commits: 0, uptimeH: 0 },
      feed: [],
      updatedAt: Date.now(),
    });
  }

  return res.status(200).json(data);
}
