'use strict';
var yeoman = require('yeoman-generator');


var NersGenerator = yeoman.generators.Base.extend({
  getAppName: function () {
    var done = this.async();
    this.prompt({
      type: 'input',
      name : 'appname',
      message: 'Project name',
      default: this.appname
    }, function (answers) {
      this.appname = answers.appname;
      done();
    }.bind(this));
  },
  installdeps: function () {
    this.on('end', function () { this.installDependencies(); });
  },
  bowerfile: function () { this.template('_bower.json', 'bower.json'); },
  packagejsonfile: function () { this.template('_package.json', 'package.json'); },
  copyFiles: function () {
    this.mkdir('public');
    this.mkdir('public/js');
    this.copy('server.js', 'sjs.js');
    this.directory('public/', 'public/');
    //this.copy('public/js/main.js', 'public/js/main.js');
    //this.copy('public/index.html', 'public/index.html');
    this.copy('server.js', 'server.js');
    this.copy('sjs.js', 'sjs.js');
  }
});

module.exports = NersGenerator;
