module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { sessionId } = req.query;
      
      if (!sessionId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Session ID is required' 
        });
      }

      // In a production app, you'd use a real database
      // For this demo, we'll use Vercel's edge config or simple storage
      // Since we can't easily persist data between requests in Vercel functions,
      // we'll return a simple response that indicates data should be checked
      
      res.status(200).json({ 
        success: true, 
        message: 'Check localStorage for webhook response',
        sessionId: sessionId
      });
      
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error retrieving data',
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 