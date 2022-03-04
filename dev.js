const liveServer = require('live-server');

const params = {
  port: 5001, // Set the server port. Defaults to 8080.
  root: '.', // Set root directory that's being served. Defaults to cwd.
  file: 'index.html' // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
};
liveServer.start(params);
