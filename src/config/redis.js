const redis = require('redis');
require('dotenv').config();

const pool = require('../config/database');
require('dotenv').config();

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

// Graceful shutdown
const closeRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.log('Redis connection closed');
  }
};

module.exports = { redisClient, connectRedis, closeRedis };
