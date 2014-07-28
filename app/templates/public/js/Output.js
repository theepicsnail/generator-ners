define([], function () {
  $('#output').height(300);
  var pre = $('#chat');
  function timeStamp() {
    var d = new Date();
    return d.toLocaleDateString();
  }
  function append(content) {
    pre.append('[' + timeStamp() + ']:' + content + '\n');
    var output = $('#output');
    output.scrollTop(output.height()+10);
  }
  return {
    append: append,
    output:pre
  };
});
