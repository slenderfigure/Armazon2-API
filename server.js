const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

const app = require('./app');

// Set PORT
const PORT = process.env.PORT || 4500;

// Run Server
const server = app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

// Drop server connection on exception error
process.on('uncaughtException', error => {
  console.log(error.message);
  server.close(() => process.exit(1));
});