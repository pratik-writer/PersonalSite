# dustjs-express [![](https://travis-ci.org/raxell/dustjs-express.png)](https://travis-ci.org/raxell/dustjs-express)

[Dust.js](http://www.dustjs.com/) view engine for [Express](http://expressjs.com/).

## Installation

```
npm install dustjs-express
```

## Usage

```javascript
var express = require('express');
var app = express();
var dustjsExpress = require('dustjs-express');

// directory where to look for templates
app.set('views', path.join(__dirname, 'views'));
// you can pass an array of directories too
app.set('views', [
    path.join(__dirname, 'module1/views'),
    path.join(__dirname, 'module2/views')
]);
app.set('view engine', 'dust');
app.engine('dust', dustjsExpress.engine());

// enable caching of templates to avoid reading from
// disk at each request (use in production)
app.set('view cache', true);

app.get('/', function(req, res) {
    // render the index.dust template located in
    // one of the specified views directories
    res.render('index', {name: 'Marco'});
});
```

You can use any file extension for templates, just specify it in the following way:
```javascript
// use .tpl as templates extension
app.set('view engine', 'tpl');
app.engine('tpl', dustjsExpress.engine());
```

## Multiple template directories
You can specify multiple directories where to look for templates:
```javascript
app.set('views', [
    path.join(__dirname, 'module1/views'),
    path.join(__dirname, 'module2/views')
]);
```
Templates are looked up in the order they occur in the array.
To avoid problems it's preferable for templates to have different names, even if
they are in different directories.
