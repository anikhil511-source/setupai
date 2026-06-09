export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sentiment } = req.query;
    const tursoUrl = process.env.TURSO_URL;
    const tursoToken = process.env.TURSO_TOKEN;

    if (!tursoUrl || !tursoToken) {
      return res.status(500).json({ error: 'Turso credentials not configured' });
    }

    // Build SQL query with optional sentiment filter
    let sql = 'SELECT * FROM cards ORDER BY createdAt DESC';
    const params = [];

    if (sentiment && sentiment !== 'All') {
      sql = 'SELECT * FROM cards WHERE sentiment = ? ORDER BY createdAt DESC';
      params.push(sentiment);
    }

    // Call Turso HTTP API
    const response = await fetch(`${tursoUrl}/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tursoToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        statements: [
          {
            q: sql,
            params: params,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'Database query failed' });
    }

    const data = await response.json();
    const rows = data.results?.[0]?.rows || [];

    const cards = rows.map((row) => ({
      id: row[0],
      title: row[1],
      summary: row[2],
      ticker: row[3],
      sector: row[4],
      sentiment: row[5],
      confidence: row[6],
      riskLevel: row[7],
      recommendation: row[8],
      analysis: row[9],
      colorCode: row[10],
      source: row[11],
      url: row[12],
      createdAt: row[13],
    }));

    res.status(200).json(cards);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch cards', details: error.message });
  }
}
