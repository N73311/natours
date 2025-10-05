// IMPORT MODULES
const dotenv = require('dotenv');

//!LISTENER FOR UNCAUGHT EXCEPTIONS
// Safety net in case exceptions are not caught explicitly
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! Shutting Down...');
  process.exit(1);
});

// SET CONFIGURATION PATH
dotenv.config({ path: './config.env' });

// Force in-memory database for containerized deployment
process.env.USE_IN_MEMORY_DB = 'true';

const mongoose = require('./utils/mongooseLoader');
const app = require('./app');

// Initialize database
const initDB = async () => {
  if (process.env.USE_IN_MEMORY_DB === 'true') {
    await mongoose.connect();
    console.log('In-memory database initialized successfully...');
  } else {
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection successful...');
  }
};

initDB();

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//!LISTENER FOR UNHANDLED REJECTIONS
// Safety net in case promise rejections are not caught explicitly
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});

//!LISTENER FOR SIGTERM SIGNAL
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED! Shutting Down');
  server.close(() => {
    console.log('PROCESS TERMINATED!');
    //Sigterm shuts down the program here
  });
});
