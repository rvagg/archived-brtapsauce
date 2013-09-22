const request = require('request')

function getLastJobId (user, key, callback) {
  request.get(
      {
          url  : 'https://' + user + ':' + key + '@saucelabs.com/rest/v1/' + user + '/jobs?limit=1&full=true'
        , json : true
      }
    , function (err, resp, body) {
        if (err)
          return callback(err)
        if (!body[0] || !body[0].id)
          return callback(new Error('can\'t decode response from saucelabs: ' + JSON.stringify(body)))

        callback(null, body[0].id)
      }
  )
}

function setPassedStatus (user, key, job, passed, callback) {
  request.put(
      {
          url  : 'https://' + user + ':' + key + '@saucelabs.com/rest/v1/' + user + '/jobs/' + job
        , json : true
        , body : JSON.stringify({ passed: passed })
      }
    , callback
  )
}

function setLastJobPassedStatus (user, key, passed, callback) {
  getLastJobId(user, key, function (err, job) {
    if (err)
      return callback(err)

    setPassedStatus(user, key, job, passed, callback)
  })
}

module.exports = setLastJobPassedStatus