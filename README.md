# Open URL JS 🔍

Simply manage urls.

## Install

```
npm install open-url-js
```

## Usage

```javascript
var url = new Url('https://www.myapp.com:3000/users/:id/#profile?user[lang]=fr');
url;
// => Url {
//      protocol: 'https',
//      host: 'www.myapp.com',
//      port: 3000,
//      path: Pathname ['users', ':id', root: true],
//      hash: 'profile',
//      parameters: Parameters {
//        user: Parameters {
//          lang: fr
//        }
//      }
//    }

url.id = 4;
url.string;
// => 'https://www.myapp.com:3000/users/4/#profile?user[lang]=fr';

url.parameters = {
  lang: 'en',
  zone: 'United States'
};
url.string;
// => 'https://www.myapp.com:3000/users/4/#profile?lang=fr&zone=United%20States';
```

