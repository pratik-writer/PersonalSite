'use strict';

var dust = require('dustjs-linkedin');
var dustjsExpress = require('../lib/dust_express.js');
var path = require('path');
var assert = require('chai').assert;

var templates = {
  hello: path.join(__dirname, 'views/hello.dust'),
  helloPartial: path.join(__dirname, 'views/hello_partial.dust'),
  helloInlinePartial: path.join(__dirname, 'views/hello_inline_partial.dust'),
  nonexistentPartial: path.join(__dirname, 'views/nonexistent_partial.dust'),
  nonexistent: path.join(__dirname, 'nonexistent'),
  helloPartialCustom: path.join(__dirname, 'views/hello_partial2.tpl'),
  helloHelper: path.join(__dirname, 'views/hello_helper.dust')
};
var options = {
  settings: {
    'views': [
      __dirname,
      path.join(__dirname, 'views'),
      path.join(__dirname, 'partials')
    ],
    'view engine': 'dust',
    'view cache': false
  },
  name: 'Marco'
};
var render = dustjsExpress.engine();

var reloadModule = function() {
  delete require.cache[require.resolve('../lib/dust_express.js')];
  dustjsExpress = require('../lib/dust_express.js');
  render = dustjsExpress.engine();
};

describe('Single template', function() {
  it('should throw an error if the template does not exist', function(done) {
    render(templates.nonexistent, options, function(err) {
      assert.isNotNull(err);

      done();
    });
  });

  it('should retrieve and render the template code from the given path', function(done) {
    render(templates.hello, options, function(err, output) {
      if (err) {
        console.log(err);
      }

      assert.strictEqual(output, 'Hello Marco');

      done();
    });
  });
});

describe('Partials', function() {
  it('should throw an error if the partial does not exist', function(done) {
    render(templates.nonexistentPartial, options, function(err) {
      assert.isNotNull(err);

      done();
    });
  });

  it('should lookup partials in multiple directories', function(done) {
    render(templates.helloPartial, options, function(err, output) {
      if (err) {
        console.log(err);
      }

      assert.strictEqual(output, 'Hello Marco');

      done();
    });
  });

  it('should lookup inline partials in multiple directories', function(done) {
    render(templates.helloInlinePartial, options, function(err, output) {
      if (err) {
        console.log(err);
      }

      assert.strictEqual(output, 'Hello Marco');

      done();
    });
  });
});

describe('Templates cache', function() {
  beforeEach(function(done) {
    reloadModule();

    done();
  });

  it('should load templates from disk if cache is disabled', function(done) {
    options.settings['view cache'] = false;

    render(templates.hello, options, function(err, output) {
      assert.isFalse(dust.config.cache);
      assert.deepEqual(dust.cache, {});

      done();
    });
  });

  it('should load templates from cache if it is enabled', function(done) {
    options.settings['view cache'] = true;

    render(templates.hello, options, function(err, output) {
      assert.isTrue(dust.config.cache);
      assert.property(dust.cache, templates.hello);

      done();
    });
  });
});

describe('Custom template file extension', function() {
  before(function(done) {
    reloadModule();
    options.settings['view engine'] = 'tpl';

    done();
  });

  it('should search the templates using a custom file extension', function(done) {
    render(templates.helloPartialCustom, options, function(err, output) {
      if (err) {
        console.log(err);
      }

      assert.strictEqual(output, 'Hello Marco');

      done();
    });
  });
});

describe('Helpers', function() {
  it('should use the global helpers', function(done) {
    render(templates.helloHelper, options, function(err, output) {
      if (err) {
        console.log(err);
      }

      assert.strictEqual(output, 'Hello Marco');

      done();
    });
  });
});
