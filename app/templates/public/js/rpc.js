'use strict';
var SockJS, Promise, define;
define([], function () {
  return function (prefix) {
    prefix = prefix || '/sjs';
    var sock = new SockJS(prefix);

    function Stub(socket) {
      this.rpcId = 0;
      this.pendingRpcs = {};
      this.handlers = {};

      this.on = this.on.bind(this);
      this.call = this.call.bind(this);
      this.send = socket.send; // accepts a string

      socket.onmessage = this.onMessage.bind(this);
    }

    Stub.prototype = {
      send: function (obj) {
        console.log('stub:', obj);
      },
      call: function (eventName, args) {
        /*
          rpc.call('foo',[ 1, 2, 3]);
          sends an rpc
        */
        return new Promise(function (ret) {
          var id = this.rpcId ++;
          this.pendingRpcs[id] = ret;
          this.send({ rpcId: id,
                      direction: 'request',
                      eventName: eventName,
                      args: args });
        });
      },

      onMessage: function (message) {
        var obj = JSON.parse(message);
        // rpc request {rpcId:0, direction:'request', eventName: 'asdf', args:[] }
        // rpc reply   {rpcId:0, direction:'reply', value:'something' }

        var id = obj.rpcId;

        function callHandler(handler, args) {
          setTimeout(function () {
            new Promise(function(accept) {
              var ret;
              try {
                // allow 'this.return' to be called for async functions
                ret = handler.apply({'return': accept}, args);
              } finally {
                if(ret !== undefined) {
                  accept(ret);
                }
              }
            }).then(function (value) {
              this.send({ rpcId: id,
                          direction: 'reply',
                          value: value});
            });
          }, 0);
        }

        if (obj.direction === 'request') { // Handle rpc request
          var handlers = this.handlers[obj.eventName];
          for (var hid in handlers) {
            callHandler(handlers[hid], obj.args);
          }
        }

        if (obj.direction === 'reply') { // Handle rpc replies
          (this.pendingRpcs[id] || function () {})(obj.value);
        }
      },

      on: function (eventName, callback) {
        /*
          rpc.on('foo', function (a+b) {
            return a+b;
          });

          rpc.on('query', function(str) {
            redis.query(str).then(function(reply) {
              // async return
              this.return(reply);
            });
          });
        */
        this.handlers[eventName] = (this.handlers[eventName] || []).concat([callback]);
      }
    };
    return new Stub(sock);
  };
});
