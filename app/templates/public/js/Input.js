define([], function () {

  function Input() {
    this.onMessage = function () {}; // noop message handler
    var input = $('#input');

    // wrapper to call onMessage whenever it is rebound
    var handleMessage = function (msg) {
      this.onMessage(msg);
    }.bind(this);

    input.keyup(function (e) {
      var msg = $(this).val();
      if (e.keyCode === 13) {
        if (msg !== '') {
          handleMessage(msg);
          $(this).val('');
        }
      }
    });
  };

  return new Input();
});
