(function(local_port) {
  'use strict';

  local_port = local_port || 9090;

  // simple express server
  var express = require('express');
  var serveIndex = require('serve-index');
  var app = express();
  
  console.log('Starting server...');
  
  app.use(serveIndex('./'), log_server);
  var log_server =  function(req, res, next) {
    console.log(req.originalUrl);
    next();
  };
  
  app.use(express.static('./'));
  // routing
  app.use('/content/images', express.static('./img'));
  
  app.listen(local_port);

  return app;
})(process.argv[2]);
