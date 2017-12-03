var Url = require('./index.js');

var components = {
  protocol: 'http',
  port: 3000,
  path: 'hey/you',
  host: 'host.name',
  hash: 'hash',
  parameters: 'key=value'
};

var url = new Url();
var keys = Object.keys(components);
var combinations = parseInt('1' + (new Array(keys.length).fill(0).join('')), 2);
var failed = 0;

for(var i = 0; i < combinations; i++) {
  url.clear();
  var number = i.toString(2).split('').map(digit => parseInt(digit, 10));

  (new Array(keys.length).fill(() => 0)).splice(number.length).concat(number).forEach((enabled, i) => {
    if(enabled) {
      var component = keys[i];
      url[component] = components[component];
    }
  });

  var string = url.string;
  var test = new Url(string);

  if(string !== test.string) {
    console.log('-----------------------');
    console.log('\x1b[31mFailed:\x1b[0m');
    console.log('Original string: ' + string);
    console.log('Parsed url:');
    keys.forEach(key => console.log('  - ' + key + ': ' + JSON.stringify(test[key])))
    failed++;
  }
}

if(!failed) console.log('\x1b[32mSuccess: ' + combinations + ' combinations passed.\x1b[0m');
else {
  console.log('-----------------------');
  console.log('\x1b[31mError: ' + failed + ' combinations failed.\x1b[0m');
}
