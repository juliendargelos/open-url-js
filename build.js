var exec = require('child_process').exec;
var fs = require('fs');

exec('browserify index.js > dist/index.js');

fs.readFile('index.js', 'utf8', function(error, data) {
  if(error) throw error;

  data = data.replace(/(module\.exports\s*=\s*|var\s+[^\s]+\s*=\s*require\(['"][^'"]+['"]\);\n+)/g, '');

  fs.writeFile('dist/open-url.js', data, function(error) {
    if(error) throw error;
  });
});
