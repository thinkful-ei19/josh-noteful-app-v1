'use strict';

const requestLogger = function(req, res, next){
  const now = new Date();
  console.log(now, req.method, req.url);
  next();
};

module.exports = requestLogger;
