module.exports = class Host extends Array {
  constructor(string) {
    super();
    this._port = null;
    this.string = string;

  }

  get domains() {
    return this._domains;
  }

  set domains(v) {
    this._domains = Array.prototype.map.call(v, domain => domain + '').filter(domain => domain);
  }

  clear() {
    for(var i = 0; i < this.length; i++) {
      if([undefined, false, null].includes(this[i])) {
        super.splice(i, 1);
        i--;
      }
      else this[i] = this[i] + '';
    }

    return this;
  }

  splice(...args) {
    var result = super.splice(...args);
    this.clean();

    return result;
  }

  get domain() {
    return this.splice(this.length - 2).join('.');
  }

  set domain(v) {
    v = v ? (v + '').split('.') : [];
    this.splice(0, this.domains.length - 2, 2, v.slice(v.length - 2));
  }

  get port() {
    return this._port;
  }

  set port(v) {
    v = parseInt(v);
    this._port = isNaN(v) ? null : v;
  }

  get name() {
    return this.join('.');
  }

  set name(v) {
    this.splice(0, this.length, (v ? (v + '') : '').split('.'));
  }

  get tld() {
    return this.length === 0 ? null : this[this.length - 1];
  }

  set tld(v) {
    if(this.length === 0) this.splice(0, 0, v);
    else this.splice(this.length, 0,  v);
  }

  get string() {
    return this.name + (this.port === null ? '' : ':' + this.port);
  }

  set string(v) {
    v = (v ? v + '' : '').split(':');
    this.name = v[0];
    this.port = v[1];
  }

  toString() {
    return this.string;
  }
}
