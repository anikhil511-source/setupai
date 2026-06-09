import { query } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { sentiment } = req.query;
    
    let sql = 'SELECT * FROM cards WHERE 1=1';
    const params = [];

    if (sentiment) {
      sql += ' AND sentiment = ?';
      params.push(sentiment);
    }

    sql += ' ORDER BY createdAt DESC LIMIT 50';

    const cards = await query(sql, params);
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}