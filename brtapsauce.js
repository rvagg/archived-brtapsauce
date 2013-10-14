const Runner       = require('sauce-tap-runner')
    , browserify   = require('browserify')
    , xtend        = require('xtend')

function brtapsauce (options, callback) {
  if (!options)
    throw new Error('must supply an options object')
  if (typeof options.name != 'string')
    throw new Error('must supply a project `name` option')
  if (typeof options.user != 'string')
    throw new Error('must supply a saucelabs `user` option')
  if (typeof options.key != 'string')
    throw new Error('must supply a saucelabs `key` option')
  if (typeof options.brsrc != 'string')
    throw new Error('must supply a browserify `brsrc` file option')
  if (!Array.isArray(options.capabilities))
    throw new Error('must supply a `capabilities` array option')

  var tests = new Runner(options.user, options.key)
    , i = 0

  if (!options.build)
    options.build = String(Date.now())

  ;(function next () {
    var cap = xtend(options.capabilities[i])
    cap.name            = options.name + ' ' + cap.platform + ' ' + cap.browserName + ' ' + (cap.version || '*')
    cap['capture-html'] = true
    cap.build           = options.build

    run(cap, function (err) {
      if (err)
        return closeTests(err)

      if (++i == options.capabilities.length)
        return closeTests()

      next()
    })
  })()

  function src (callback) {
    callback(null, browserify().add(options.brsrc).bundle())
  }

  function run (cap, callback) {
    console.log('Running', cap.name)
    tests.run(src, cap, options.options || {}, function(err, results) {
      if (err)
        return callback(err)

      printResults(cap, results)
      callback()
    })
  }

  function printResults (cap, results) {
    console.log('Results for', cap.name, '\n')

    results.asserts.forEach(function (assert) {
      console.log(
          (assert.ok ? 'ok' : 'NOT OK')
        + ' ' + assert.number
        + ' ' + assert.name
      )
    })

    if (results.fail && results.fail.length) {
      console.log('\nFails:')
      console.log(JSON.stringify(results.fail, 0, 2))
    }

    if (results.errors && results.errors.length) {
      console.log('\nErrors:')
      console.log(JSON.stringify(results.errors, 0, 2))
    }

    console.log()
    console.log(cap.name)
    console.log(results.ok ? 'OK' : 'NOT OK')
    console.log()
  }

  function closeTests (err) {
    if (err)
      console.error(err)
    else
      console.log('Tests completed')

    tests.close(function() {
      if (typeof callback == 'function')
        return callback(err)

      process.exit(err ? -1 : 0)
    })
  }
}

module.exports = brtapsauce
