// Endpoint to get the latest ideas without sessionId
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
      // Get the global storage
      if (!global.ideaStorage) {
        global.ideaStorage = new Map();
      }
      
      const ideaStorage = global.ideaStorage;
      
      if (ideaStorage.size === 0) {
        return res.status(404).json({
          success: false,
          message: 'No ideas found'
        });
      }
      
      // Get the most recent entry
      let latestEntry = null;
      let latestTimestamp = null;
      
      for (const [sessionId, data] of ideaStorage.entries()) {
        const entryTime = new Date(data.timestamp).getTime();
        if (!latestTimestamp || entryTime > latestTimestamp) {
          latestTimestamp = entryTime;
          latestEntry = { sessionId, data };
        }
      }
      
      if (!latestEntry) {
        return res.status(404).json({
          success: false,
          message: 'No ideas found'
        });
      }
      
      console.log('Returning latest ideas:', latestEntry);
      
      res.status(200).json({
        success: true,
        data: latestEntry.data,
        sessionId: latestEntry.sessionId
      });

    } catch (error) {
      console.error('Error retrieving latest ideas:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving latest ideas',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 