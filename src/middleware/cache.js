const { redisClient } = require('../config/redis');

const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}:${req.auth?.sub || 'anonymous'}`;

    try {
      if (redisClient.isOpen) {
        const cachedData = await redisClient.get(key);
        
        if (cachedData) {
          console.log(`Cache hit for ${key}`);
          return res.json(JSON.parse(cachedData));
        }
      }

      // Store original send function
      const originalSend = res.json.bind(res);

      // Override send function to cache the response
      res.json = function (data) {
        // Cache the response
        if (redisClient.isOpen && res.statusCode === 200) {
          redisClient.setEx(key, ttl, JSON.stringify(data))
            .catch(err => console.error('Cache set error:', err));
        }
        
        return originalSend(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

const clearCache = async (pattern) => {
  try {
    if (redisClient.isOpen) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`Cleared ${keys.length} cache keys matching ${pattern}`);
      }
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

module.exports = { cacheMiddleware, clearCache };
