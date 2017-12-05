# Open URL JS 🔍
[![npm version](https://badge.fury.io/js/open-url-js.svg)](https://badge.fury.io/js/open-url-js)
[![Maintainability](https://api.codeclimate.com/v1/badges/27a140e4e8a692f19938/maintainability)](https://codeclimate.com/github/juliendargelos/open-url-js/maintainability)

Simply manage urls.

## Install

```
npm install open-url-js
```

## Usage

```javascript
var Url = require('open-url-js');

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

<a name="Url"></a>

## Url
**Kind**: global class  

* [Url](#Url)
    * [new Url(...string)](#new_Url_new)
    * [.string](#Url+string) : <code>string</code>
    * [.protocol](#Url+protocol) : <code>string</code>
    * [.host](#Url+host) : <code>string</code>
    * [.port](#Url+port) : <code>string</code>
    * [.hash](#Url+hash) : <code>string</code>
    * [.path](#Url+path) : <code>Pathname</code>
    * [.parameters](#Url+parameters) : <code>Parameters</code>
    * [.clear()](#Url+clear) ⇒ [<code>Url</code>](#Url)
    * [.toString()](#Url+toString) ⇒ <code>string</code>

<a name="new_Url_new"></a>

### new Url(...string)
Create a [Url](#Url) object.


| Param | Type | Description |
| --- | --- | --- |
| ...string | <code>Object</code> | Same value as [string](#Url+string). |

<a name="Url+string"></a>

### url.string : <code>string</code>
A string corresponding to the url. When set, it will be parsed.

**Kind**: instance property of [<code>Url</code>](#Url)  
<a name="Url+protocol"></a>

### url.protocol : <code>string</code>
The protocol of the url.

**Kind**: instance property of [<code>Url</code>](#Url)  
<a name="Url+host"></a>

### url.host : <code>string</code>
The host of the url.

**Kind**: instance property of [<code>Url</code>](#Url)  
<a name="Url+port"></a>

### url.port : <code>string</code>
The port of the url.

**Kind**: instance property of [<code>Url</code>](#Url)  
<a name="Url+hash"></a>

### url.hash : <code>string</code>
The hash of the url.

**Kind**: instance property of [<code>Url</code>](#Url)  
<a name="Url+path"></a>

### url.path : <code>Pathname</code>
The path of the url.

**Kind**: instance property of [<code>Url</code>](#Url)  
<a name="Url+parameters"></a>

### url.parameters : <code>Parameters</code>
The parameters of the url.

**Kind**: instance property of [<code>Url</code>](#Url)  
<a name="Url+clear"></a>

### url.clear() ⇒ [<code>Url</code>](#Url)
Clears the url.

**Kind**: instance method of [<code>Url</code>](#Url)  
**Returns**: [<code>Url</code>](#Url) - Itself.  
<a name="Url+toString"></a>

### url.toString() ⇒ <code>string</code>
**Kind**: instance method of [<code>Url</code>](#Url)  
**Returns**: <code>string</code> - Value of [string](#Url+string).  
