if(typeof require !== 'function') require = function() {};
if(!Pathname) var Pathname = require('pathname-js');
if(!Parameters) var Parameters = require('parameters-js');

class Url {
  constructor(string) {
    this.parameters = new Parameters();
    this.pathname = new Pathname();
  }
}
