export default async function handler(req, res) {
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
      const sessionId = data.sessionId; // This should come from n8n workflow
      
      // Store the ideas using the storage API
      if (sessionId) {
        try {
          await fetch(`${req.headers.host}/api/store-ideas`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: sessionId,
              ideas: ideasContent,
              timestamp: timestamp
            })
          });
          console.log(`Ideas stored for session: ${sessionId}`);
        } catch (storeError) {
          console.error('Error storing ideas:', storeError);
        }
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