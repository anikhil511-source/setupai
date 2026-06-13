export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sentiment } = req.query;
    const tursoUrl = process.env.TURSO_URL;
    const tursoToken = process.env.TURSO_TOKEN;

    if (!tursoUrl || !tursoToken) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const httpUrl = tursoUrl.replace('libsql://', 'https://');

    let sql = 'SELECT * FROM cards ORDER BY createdAt DESC LIMIT 100';
    let args = [];

    if (sentiment && sentiment !== 'All') {
      sql = 'SELECT * FROM cards WHERE sentiment = ? ORDER BY createdAt DESC LIMIT 100';
      args = [{ type: 'text', value: sentiment }];
    }

    const response = await fetch(`${httpUrl}/v2/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tursoToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          { type: 'execute', stmt: { sql, args } },
          { type: 'close' },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Query failed', detail: errText });
    }

    const data = await response.json();

    const result = data.results?.[0]?.response?.result;
    const rows = result?.rows || [];

    const cards = rows.map((row) => {
  const v = row.map((cell) => (cell && cell.value !== undefined ? cell.value : cell));
  return {
    id: v[0],
    title: v[1],
    summary: v[2],
    ticker: v[3],
    sector: v[4],
    sentiment: v[5],
    confidence: v[6],
    riskLevel: v[7],
    recommendation: v[8],
    analysis: v[9],
    colorCode: v[10],
    source: v[11],
    url: v[12],
    pubDate: v[13],
    createdAt: v[14],
  };
});

    res.status(200).json(cards);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
}