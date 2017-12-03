(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Pathname = require('pathname-js');
var Parameters = require('parameters-js');

module.exports = class Url {
  static empty(value) {
    return [undefined, null].includes(value);
  }

  /**
   * Create a {@link Url} object.
   * @param {...{(string)}} string Same value as {@link Url#string}.
   */
  constructor(string) {
    this.protocol = this._host = this._port = this._hash = '';
    this.path = new Pathname();
    this.parameters = new Parameters();
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
    if(v instanceof Pathname) this._path = v;
    else this._path.clear().concat(this.constructor.empty(v) ? '' : v);
  }

  /**
   * The parameters of the url.
   * @type {Parameters}
   */
  get parameters() {
    return this._parameters;
  }

  set parameters(v) {
    if(v instanceof Parameters) this._parameters = v;
    if(typeof v === 'string') this._parameters.string = this.constructor.empty(v) ? '' : v;
    else this._parameters.clear().set(v);
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

},{"parameters-js":2,"pathname-js":3}],2:[function(require,module,exports){
module.exports = class Parameters {

  /**
   * Create a {@link Parameters} object.
   * @param {...{(string|Object)}} parameters Same value as {@link Parameters#set}'s parameters.
   */
  constructor(...parameters) {
    this.set(...parameters);
  }

  static flatten(object, current, flattened) {
    if(!current) current = '';
    if(!flattened) flattened = [];

    if(['boolean', 'number', 'string'].includes(typeof object) || object === null) {
      flattened.push({key: current, value: object});
    }
    else if(Array.isArray(object)) {
      object.forEach(value => this.flatten(value, this.key(current, ''), flattened));
    }
    else if(typeof object === 'object') {
      for(var key in object) {
        if(object.hasOwnProperty(key)) this.flatten(object[key], this.key(current, key), flattened);
      }
    }

    return flattened;
  }

  static deepen(object, key, value) {
    var match = key.match(/^[\[\]]*([^\[\]]+)\]*/);
    var after = key.substring(match[0].length) || ''
    var key = match[1] || ''
    value = decodeURIComponent(value);

    if(key === '') return;

    if(after === '') object[key] = value;
    else if(after === '[]') {
      if(!object[key]) object[key] = [];
      object[key].push(value);
    }
    else {
      match = [after.match(/^\[\]\[([^\[\]]+)\]$/), after.match(/^\[\](.+)$/)].find(match => !!match);

      if(match) {
        var childKey = match[1];
        if(!object[key]) object[key] = [];

        var last = object[key].length - 1;
        if(last < 0) last = 0;

        if(typeof object[key][last] === 'object' && object[key][last] !== null && !Object.keys(object[key][last]).includes(childKey)) {
          this.deepen(object[key][last], childKey, value);
        }
        else object[key].push(this.deepen(new object.constructor(), childKey, value));
      }
      else {
        if(!object[key]) object[key] = new object.constructor();
        object[key] = this.deepen(object[key], after, value);
      }
    }

    return object;
  }

  static key(current, key) {
    return current ? current + '[' + key + ']' : key;
  }

  /**
   * The parameters keys.
   * @readonly
   * @type {string[]}
   */
  get keys() {
    return Object.getOwnPropertyNames(this);
  }

  /**
   * @typedef {Object} FlatParameter
   * @property {string} key The flattened key of the parameter.
   * @property {(string|number|boolean)?} value The value of the parameter
   */

  /**
   * A flat array corresponding to the parameters. When set, the given flattened parameters array will be parsed to replace the current parameters.
   * @type {FlatParameter[]}
   */
  get flattened() {
    return this.constructor.flatten(this);
  }

  set flattened(v) {
    this.clear();

    v.forEach(parameter => {
      this.constructor.deepen(this, parameter.key, parameter.value);
    });
  }

  /**
   * A string corresponding to the parameters, ready to be used in a url.  When set, the given string will be parsed to replace the current parameters.
   * @type {string}
   */
  get string() {
    var parameters = [];

    this.flattened.forEach(parameter => {
      if(parameter.value !== null) parameters.push(parameter.key + '=' + encodeURIComponent(parameter.value));
    });

    return parameters.join('&');
  }

  set string(v) {
    this.flattened = (v + '').split('&').map(parameter => {
      parameter = parameter.split('=');
      return {key: parameter[0], value: parameter[1]};
    });
  }

  /**
   * A set of inputs corresponding the parameters. When set, the given inputs will be parsed to replace the current parameters.
   * @type {(FragmentDocument|NodeList|Array)}
   */
  get inputs() {
    var inputs = document.createDocumentFragment();

    this.flattened.forEach(parameter => {
      var input = document.createElement('input');
      var value = [null, undefined].includes(parameter.value) ? '' : parameter.value;
      input.name = parameter.key;

      if(typeof parameter.value === 'boolean') {
        input.type = 'checkbox';
        inputs.checked = value;
      }
      else {
        if(typeof parameter.value === 'number') input.type = 'number';
        else input.type = 'hidden';

        input.setAttribute('value', value);
        inputs.value = value;
      }

      inputs.appendChild(input);
    });

    return inputs;
  }

  set inputs(v) {
    if(v instanceof DocumentFragment) v = v.querySelector('input, textarea, select');
    this.flattened = Array.prototype.map.call(v, input => {
      var value;
      if(input.type === 'file') value = input.multiple ? input.files : input.files[0];
      else if(input.type === 'checkbox') value = input.checked;
      else if(input.type === 'number') value = parseFloat(input.value);
      else value = input.value;

      return {key: input.name, value: value};
    });
  }

  /**
   * A FormData corresponding to the parameters.
   * @readonly
   * @type {FormData}
   */
  get formData() {
    var formData = new FormData();
    this.flattened.forEach(parameter => formData.append(parameter.key, parameter.value));

    return formData;
  }

  /**
   * A Form corresponding to the parameters. When set, the given form inputs be parsed to replace the current parameters.
   * @type {(HTMLFormElement|Element)}
   */
  get form() {
    var form = document.createElement('form');
    form.appendChild(this.inputs);

    return form;
  }

  set form(v) {
    try {
      this.inputs = v.querySelector('input, textarea, select');
    }
    catch(e) {
      throw e;
    }
  }

  /**
   * A json string corresponding to the parameters.  When set, the given json string will be parsed to replace the current parameters.
   * @type {string}
   */
  get json() {
    return JSON.stringify(this);
  }

  set json(v) {
    try {
      this.set(JSON.parse(v));
    }
    catch(e) {
      throw e;
    }
  }

  /**
   * A clone of the current parameters.
   * @readonly
   * @type {Parameters}
   */
  get clone() {
    return new this.constructor(this);
  }

  /**
   * <code>true</code> if no value different from <code>null</code> can be found in the parameters, <code>false</code> in the other case.
   * @readonly
   * @type {boolean}
   */
  get empty() {
    var empty = true;
    this.each((key, value) => {
      if(value !== null) empty = false;
    });

    return empty;
  }

  /**
   * Opposite of {@link Parameters#empty}.
   * @readonly
   * @type {boolean}
   */
  get any() {
    return !this.empty;
  }

  /**
   * @returns {string} Value of {@link Parameters#string}
   */
  toString() {
    return this.string;
  }

  /**
   * Set parameters.
   * @param {...(string|Object)} parameters The parameters to set. If string given the assumed value will be <code>null</code>.
   * @returns {Parameters} Itself.
   */
  set(...parameters) {
    parameters.forEach(parameters => {
      if(typeof parameters === 'string') parameters = {[parameters]: null};
      if(typeof parameters === 'object' && parameters !== null) {
        for(var key in parameters) this[key] = parameters[key];
      }
    });

    return this;
  }

  /**
   * Unset parameters.
   * @param {...{(string)}} keys The parameter keys to unset.
   * @returns {Parameters} Itself.
   */
  unset(...keys) {
    keys.forEach(key => { this.index(key, index => delete this[key]) });

    return this;
  }

  /**
   * @callback indexCallback
   * @param {number} index The index of the key.
   */

  /**
   * Looks for the index of the given key and call callback if it was found.
   * @param {string} key The parameter key whose index your looking for
   * @param {indexCallback=} callback The function to call if an index has been found for this key.
   * @returns {number?} The index of the given key if it exists, null in the other case.
   */
  index(key, callback) {
    var index = this.keys.indexOf(key);
    if(index === -1) index = null;
    if(typeof callback === 'function' && index !== null) callback.call(this, index);

    return index;
  }

  /**
   * @callback haveCallback
   */

  /**
   * Checks that the given key exists and call a callback if it exists.
   * @param {string} key The parameter key you want to check the existence.
   * @param {haveCallback=} callback The function to call if the key exists.
   * @returns {boolean} <code>true</code> if the key exists, false in the other case.
   */
  have(key, callback) {
    return this.keys.includes(key) && (callback.call(this) || true);
  }

  /**
   * @callback eachCallback
   * @param {string} key The current key.
   * @param {*} value The current value.
   * @returns {boolean?} If strictly equal to <code>false</code>, will stop iterating.
   */

  /**
   * Iterates through parameters.
   * @param {eachCallback} callback The function to call for each parameter.
   * @returns {Parameters} Itself.
   */
  each(callback) {
    this.keys.forEach(key => {
      if(callback.call(this, key, this[key]) === false) return false;
    });

    return this;
  }

  /**
   * @callback mapCallback
   * @param {string} key The current key.
   * @param {*} value The current value.
   * @returns {*} The value that will replace the current value.
   */

  /**
   * Iterates through parameters and replaces values.
   * @param {mapCallback} callback The function to call for each parameter.
   * @returns {Parameters} Itself.
   */
  map(callback) {
    this.each((key, value) => { this[key] = callback.call(this, key, value) });

    return this;
  }

  /**
   * Set all parameter values to <code>null</code>.
   * @returns {Parameters} Itself
   */
  reset() {
    this.map(() => null);

    return this;
  }

  /**
   * Removes all the parameters.
   * @returns {Parameters} Itself
   */
  clear() {
    this.unset(...this.keys);

    return this;
  }
}

},{}],3:[function(require,module,exports){
/** @extends Array */
module.exports = class Pathname extends Array {

  /**
   * Create a {@link Pathname} object.
   * @param {...(string|Array)} parts Same value as {@link Pathname#concat}'s parameters.
   */
  constructor(...parts) {
    super();

    /**
     * <code>true</code> if the pathname is absolute, <code>false</code> in the other case.
     * @type {boolan}
     */
    this.root = false;

    this.concat(...parts);
  }

  /**
   * The path parameter keys.
   * @readonly
   * @type {string[]}
   */
  get keys() {
    return Object.getOwnPropertyNames(this);
  }

  /**
   * A clone of the path.
   * @readonly
   * @type {Pathname}
   */
  get clone() {
    return new this.constructor(this);
  }

  /**
   * Path string value, without replacing parameters by values.
   * @readonly
   * @type {string}
   */
  get raw() {
    return (this.root ? '/' : '') + this.join('/');
  }

  /**
   * Path string value, with parameters replaced by values. When set, it can have new parameters.
   * @type {string}
   */
  get string() {
    var string = this.raw;
    var value;

    for(var parameter in this) {
      if(this.hasOwnProperty(parameter)) {
        value = this[parameter];
        if(value !== null) string = string.replace(new RegExp(':' + parameter, 'g'), value);
      }
    }

    return string;
  }

  set string(v) {
    this.clear().concat(v);
  }

  /**
   * @returns {string} Value of {@link Patname#string}
   */
  toString() {
    return this.string;
  }

  /**
   * Match a pattern on the path.
   * @param {RegExp} pattern The pattern to match.
   * @returns {Array} The match result.
   */
  match(pattern) {
    return this.raw.match(pattern);
  }

  /**
   * Replace a pattern on the path.
   * @param {RegExp} pattern The pattern to replace.
   * @returns {Pathname} The replaced path.
   */
  replace(pattern, replace) {
    return new this.constructor(this.raw.replace(pattern, replace));
  }

  /**
   * Same as {@link Patname#concat}
   * @param {...(Pathname|Array|string)} parts The parts to add to the path.
   * @return {Pathname} Itself.
   */
  push(...parts) {
    return this.concat(...parts);
  }

  /**
   * Adds parts to the path.
   * @param {...(Pathname|Array|string)} parts The parts to add to the path.
   * @return {Pathname} Itself.
   */
  concat(...parts) {
    parts.forEach(part => {
      if(part instanceof Array) this.push(...part);
      else {
        part = part + '';
        if(this.length === 0 && part[0] === '/') this.root = true;
        part = part.replace(/^\/+/, '').replace(/\/+$/, '').split('/');

        if(part.length === 1) {
          part = part[0];
          if(part.length) super.push(part.replace(/\//));
        }
        else this.push(...part);
      }
    });

    return this;
  }

  /**
   * Empty the path.
   * @return {Pathname} Itself.
   */
  clear() {
    this.splice(0, this.length);
    return this;
  }

  /**
   * Set all the path parameters to null.
   * @return {Pathname} Itself.
   */
  reset() {
    for(var parameter in this) {
      if(this.hasOwnProperty(parameter)) this[parameter] = null;
    }
  }
}

},{}]},{},[1]);
