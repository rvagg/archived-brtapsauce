#!/usr/bin/env node

const http       = require('http')
    , path       = require('path')
    , serve      = require('serve-script')
    , browserify = require('browserify')

http.createServer(serve({
  src: function (callback) {
    callback(null, browserify().add(path.resolve(process.cwd(), process.argv[2])).bundle())
  }
})).listen(3000)

console.log('Listening on http://localhost:3000/')
console.log('Go there and test!')