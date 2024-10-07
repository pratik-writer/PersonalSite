'use strict';

var dust = require('dustjs-helpers');
var fs = require('fs');
var path = require('path');

var views;
var ext;
var isCacheSet = false;

var dustjsExpress = module.exports = {};

dustjsExpress.engine = function engine() {
  return function(template, options, callback) {
    checkSettings(options.settings);

    dust.render(template, options, function(err, output) {
      if (err) {
        return callback(err);
      }

      callback(err, output);
    });
  };
};

dust.onLoad = function(template, callback) {
  var templatePath = template;

  if (!path.isAbsolute(template)) {
    templatePath = lookup(template);

    if (!templatePath) {
      return callback(new Error(
        'Cannot lookup template "' + template + '" in views directories "' + views + '"'
      ));
    }
  }

  fs.readFile(templatePath, 'utf8', function(err, data) {
    if (err) {
      return callback(err);
    }

    callback(null, data);
  });
};

function checkSettings(settings) {
  if (!views) {
    views = settings.views;

    if (!Array.isArray(views)) {
      views = [views];
    }
  }

  if (!ext) {
    ext = '.' + settings['view engine'];
  }

  if (!isCacheSet) {
    dust.config.cache = settings['view cache'] || false;
    isCacheSet = true;
  }
}

function lookup(template) {
  if (path.extname(template) !== ext) {
    template += ext;
  }

  var templatePath;

  for (var i = 0; i < views.length && !templatePath; i++) {
    templatePath = path.join(views[i], template);

    if (!exists(templatePath)) {
      templatePath = undefined;
    }
  }

  return templatePath;
}

function exists(path) {
  var stat;

  try {
    stat = fs.statSync(path);
  }
  catch(e) {}

  return stat && stat.isFile();
}
