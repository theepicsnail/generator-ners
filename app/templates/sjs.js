'use strict';
/*
  Wrapper around the normal sockjs library
  This serves the purpose of wrapping the boilerplate
  around creating/registering a sockjs server
*/
var sockjs = require('sockjs');

module.exports = function (server, prefix) {
  var sjsserver = sockjs.createServer();
  prefix = prefix || '/sjs';
  if (!server) {
    console.log('server required');
    return undefined;
  }
  sjsserver.installHandlers(server, {prefix: prefix});
  return sjsserver;
};
