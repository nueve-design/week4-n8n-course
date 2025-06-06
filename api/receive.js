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
    try {
      const data = req.body;
      console.log('Received data from n8n:', data);
      
      // Extract the ideas/message from n8n
      const ideasContent = data.message || 'Ideas generated successfully!';
      const timestamp = data.timestamp || new Date().toISOString();
      let sessionId = data.sessionId; // This should come from n8n workflow
      
      // Fallback: if no sessionId, create one from timestamp or use 'latest'
      if (!sessionId) {
        sessionId = 'latest_' + timestamp.replace(/[^\d]/g, '').slice(-10);
        console.log('No sessionId provided, using fallback:', sessionId);
      }
      
      console.log('Using sessionId:', sessionId);
      console.log('Full request body:', JSON.stringify(data, null, 2));
      
      // Store the ideas directly in memory (since we can't easily call our own API)
      // Import the storage from store-ideas
      if (!global.ideaStorage) {
        global.ideaStorage = new Map();
      }
      
      if (sessionId) {
        const ideaData = {
          ideas: ideasContent,
          timestamp: timestamp,
          status: 'completed'
        };
        
        global.ideaStorage.set(sessionId, ideaData);
        console.log(`Ideas stored for session: ${sessionId}`, ideaData);
      } else {
        console.log('No sessionId provided in request - cannot store ideas');
      }
      
      // Create a response object
      const responseData = {
        success: true,
        ideas: ideasContent,
        generatedAt: timestamp,
        sessionId: sessionId,
        source: 'n8n-http-request'
      };
      
      console.log('Processed response data:', responseData);
      
      res.status(200).json({ 
        success: true, 
        message: 'Ideas received and processed successfully',
        data: responseData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error processing request',
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 