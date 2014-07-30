'use strict';

var messageId = 0;
var chatId = 0;
var connections = {};
function broadcast(message, senderId) {
  messageId ++;
  var tmp;
  for (var id in connections) {
    if (connections[id].chatId === senderId) {
      tmp = '*';
    } else {
      tmp = ' ';
    }
    connections[id].conn.write('(' + messageId + tmp + ')' + message);
  }
}

function onConnection(conn) {
  var myId = chatId ++;
  connections[conn.id] = {conn: conn, chatId: myId};
  broadcast('User ' + myId + ' has joined.', myId);
  conn.on('close', function () {
    delete connections[conn.id];
    broadcast('User ' + myId + ' has left.');
  });
  conn.on('data', function (message) {
    broadcast(message, myId);
  });
}

function startServer() {
  var express = require('express');
  var app = express(app);
  var server = require('http').createServer(app);

  app.use(express.static(__dirname + '/public'));
  app.use('/bower_components',  express.static(__dirname + '/bower_components'));
  app.get('/', function (req, res) {
    res.sendfile('index.html');
  });

  var sockServer = require('./sjs')(server);
  sockServer.on('connection', onConnection);

  port = process.env.PORT || 11235;
  server.listen(port, '0.0.0.0');
  console.log('http://localhost:' + port);
}

startServer();

