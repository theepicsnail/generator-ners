'use strict';

require.config({ baseUrl: '/js' });

require(['Output', 'Input'], function (Out, Input) {
  console.log(Input);
  var sock = new SockJS('/sjs');
  Input.onMessage = sock.send.bind(sock);
  sock.onmessage = function(event) {
    Out.append(event.data);
  };
});
