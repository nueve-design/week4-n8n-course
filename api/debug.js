// Simple debug endpoint to test if API is working
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
    console.log('Debug endpoint called');
    
    // Check global storage
    const storageInfo = {
      hasGlobalStorage: !!global.ideaStorage,
      storageSize: global.ideaStorage ? global.ideaStorage.size : 0,
      storageEntries: global.ideaStorage ? Array.from(global.ideaStorage.keys()) : []
    };
    
    console.log('Storage info:', storageInfo);
    
    res.status(200).json({
      success: true,
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      storage: storageInfo
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 