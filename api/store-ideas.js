// Simple in-memory storage for demo purposes
// In production, you'd use a real database
// Use global storage to share between API endpoints
if (!global.ideaStorage) {
  global.ideaStorage = new Map();
}
let ideaStorage = global.ideaStorage;

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Store ideas data
    try {
      const { sessionId, ideas, message, timestamp } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const ideaData = {
        ideas: ideas || message || 'Ideas generated successfully!',
        timestamp: timestamp || new Date().toISOString(),
        status: 'completed'
      };

      ideaStorage.set(sessionId, ideaData);
      
      console.log(`Stored ideas for session ${sessionId}:`, ideaData);

      res.status(200).json({
        success: true,
        message: 'Ideas stored successfully',
        sessionId: sessionId
      });

    } catch (error) {
      console.error('Error storing ideas:', error);
      res.status(500).json({
        success: false,
        message: 'Error storing ideas',
        error: error.message
      });
    }
  } 
  else if (req.method === 'GET') {
    // Retrieve ideas data
    try {
      const { sessionId } = req.query;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const ideaData = ideaStorage.get(sessionId);
      
      if (!ideaData) {
        return res.status(404).json({
          success: false,
          message: 'Ideas not found for this session'
        });
      }

      res.status(200).json({
        success: true,
        data: ideaData
      });

    } catch (error) {
      console.error('Error retrieving ideas:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving ideas',
        error: error.message
      });
    }
  } 
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 