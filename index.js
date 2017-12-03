if(typeof require === 'function') {
  var Pathname = require('pathname-js');
  var Parameters = require('parameters-js');
}

class Url {
  static empty(value) {
    return [undefined, null].includes(value);
  }

  /**
   * Create a {@link Url} object.
   * @param {...{(string)}} string Same value as {@link Url#string}.
   */
  constructor(string) {
    this._protocol = this._host = this._port = this._hash = '';
    this._path = new Pathname();
    this._parameters = new Parameters();

    this.string = string;
  }

  /**
   * A string corresponding to the url. When set, it will be parsed.
   * @type {string}
   */
  get string() {
    return (
      (this.protocol ? this.protocol + ':' : '') +
      (this.host ? '//' + this.host : '') +
      (this.port ? ':' + this.port : '') +
      (!this.path.root && (this.host || this.port) ? '/' : '') +
       this.path +
      (this.path.length !== 0 && (this.hash || this.parameters.any) ? '/' : '') +
      (this.hash ? '#' + this.hash : '') +
      (this.parameters.any ? '?' + this.parameters : '')
    );
  }

  set string(v) {
    var match = (v + '').match(/^(?:([^:\/]+):)?(?:\/\/([^\/\?#:]+))?(?::(\d+))?([^\?#]*)(?:#([^?]*))?(?:\?(.*))?$/);

    if(match === null) match = [];

    this.protocol = match[1];
    this.host = match[2];
    this.port = match[3];
    this.path = match[4];
    this.hash = match[5];
    this.parameters = match[6];
  }

  /**
   * The protocol of the url.
   * @type {string}
   */
  get protocol() {
    return this._protocol;
  }

  set protocol(v) {
    this._protocol = this.constructor.empty(v) ? '' : v;
  }

  /**
   * The host of the url.
   * @type {string}
   */
  get host() {
    return this._host;
  }

  set host(v) {
    this._host = this.constructor.empty(v) ? '' : v;
  }

  /**
   * The port of the url.
   * @type {string}
   */
  get port() {
    return this._port;
  }

  set port(v) {
    v = parseInt(v);
    this._port = isNaN(v) ? '' : v;
  }

  /**
   * The hash of the url.
   * @type {string}
   */
  get hash() {
    return this._hash;
  }

  set hash(v) {
    this._hash = this.constructor.empty(v) ? '' : v;
  }

  /**
   * The path of the url.
   * @type {Pathname}
   */
  get path() {
    return this._path;
  }

  set path(v) {
    this.path.clear().concat(this.constructor.empty(v) ? '' : v);
  }

  /**
   * The parameters of the url.
   * @type {Parameters}
   */
  get parameters() {
    return this._parameters;
  }

  set parameters(v) {
    if(typeof v === 'string') this.parameters.string = this.constructor.empty(v) ? '' : v;
    else this.parameters.clear().set(v);
  }

  /**
   * Clears the url.
   * @returns {Url} Itself.
   */
  clear() {
    this.protocol = this.host = this.port = this.hash = this.path = this.parameters = null;
  }

  /**
   * @returns {string} Value of {@link Url#string}.
   */
  toString() {
    return this.string;
  }
}

if(typeof module === 'object' && module !== null) module.exports = Url;
