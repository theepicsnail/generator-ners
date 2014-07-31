define([], function () {
  var pre = $('#chat');
  function timeStamp() {
    var d = new Date();
    return d.toLocaleDateString();
  }
  function append(content) {
    pre.append('[' + timeStamp() + ']:');
    pre.append(document.createTextNode(content));
    pre.append('\n');
    var chat = $('#chat');
    chat.scrollTop(chat[0].scrollHeight);
  }
  return {
    append: append,
    output:pre
  };
});
