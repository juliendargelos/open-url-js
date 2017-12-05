var fs = require('fs');

var clean = function(file, destination) {
  fs.readFile(file, 'utf8', function(error, data) {
    if(error) throw error;

    data = data.replace(/(module\.exports\s*=\s*|var\s+[^\s]+\s*=\s*require\(['"][^'"]+['"]\)[^;\n]*[;\n]*)/g, '');

    fs.writeFile(destination, data, function(error) {
      if(error) throw error;
    });
  });
};

clean('index.js', 'dist/open-url.js');
