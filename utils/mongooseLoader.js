// Mongoose loader that switches between real MongoDB and in-memory database
// based on environment configuration

let mongoose;

// Check if we should use in-memory database (for containerized deployments without external dependencies)
if (process.env.USE_IN_MEMORY_DB === 'true' || !process.env.DATABASE) {
  console.log('Using in-memory database...');
  mongoose = require('./inMemoryDb');
} else {
  mongoose = require('mongoose');
}

module.exports = mongoose;