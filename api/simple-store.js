// Extremely simple storage that stores latest idea
let latestIdea = null;
let allIdeas = [];

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
    // Store idea
    try {
      const data = req.body;
      console.log('Storing idea:', data);
      
      const ideaEntry = {
        ...data,
        storedAt: new Date().toISOString(),
        id: Date.now()
      };
      
      // Store as latest
      latestIdea = ideaEntry;
      
      // Add to all ideas array (keep last 10)
      allIdeas.push(ideaEntry);
      if (allIdeas.length > 10) {
        allIdeas = allIdeas.slice(-10);
      }
      
      console.log('Idea stored successfully:', ideaEntry.id);
      
      res.status(200).json({
        success: true,
        message: 'Idea stored',
        id: ideaEntry.id
      });
      
    } catch (error) {
      console.error('Error storing idea:', error);
      res.status(500).json({
        success: false,
        message: 'Error storing idea',
        error: error.message
      });
    }
  }
  else if (req.method === 'GET') {
    // Retrieve latest idea
    try {
      console.log('Retrieving latest idea...');
      console.log('Latest idea:', latestIdea);
      console.log('All ideas count:', allIdeas.length);
      
      if (!latestIdea) {
        return res.status(404).json({
          success: false,
          message: 'No ideas found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: latestIdea,
        allIdeasCount: allIdeas.length
      });
      
    } catch (error) {
      console.error('Error retrieving idea:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving idea',
        error: error.message
      });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 