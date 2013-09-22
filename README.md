# brtapsauce

**Browserify TAP test runner for SauceLabs**

Extending [sauce-tap-runner](https://github.com/conradz/sauce-tap-runner) with automatic Browserify bundling, test queueing and execution and SauceLabs *passed-status* setting. **brtapsauce** can be used for automated tests with Travis-CI, Drone.io, or other CI system.

## Usage

Assuming you have a browserifyable file that bundles and executes tap tests (see [tape](https://github.com/substack/tape)).

Create a *test.js* file something like this:

```js
const user       = process.env.SAUCE_USER
    , key        = process.env.SAUCE_KEY
    , path       = require('path')
    , brtapsauce = require('brtapsauce')

      // list of browsers & versions that you want to test
    , capabilities = [
          { browserName: 'chrome'            , platform: 'Windows 8' , version: ''   }
        , { browserName: 'firefox'           , platform: 'Windows 8' , version: ''   }
        , { browserName: 'internet explorer' , platform: 'Windows 8' , version: '10' }
        , { browserName: 'internet explorer' , platform: 'Windows 7' , version: '9'  }
        , { browserName: 'internet explorer' , platform: 'Windows 7' , version: '8'  }
        , { browserName: 'internet explorer' , platform: 'Windows XP', version: '7'  }
        , { browserName: 'internet explorer' , platform: 'Windows XP', version: '6'  }
        , { browserName: 'safari'            , platform: 'Windows 7' , version: '5'  }
        , { browserName: 'opera'             , platform: 'Windows 7' , version: ''   }
        , { browserName: 'ipad'              , platform: 'OS X 10.8' , version: '6'  }
        , { browserName: 'android'           , platform: 'Linux'     , version: '4.0', 'device-type': 'tablet' }
      ]

if (!user)
  throw new Error('Must set a SAUCE_USER env var')
if (!key)
  throw new Error('Must set a SAUCE_KEY env var')

brtapsauce({
    name         : 'Project Name'
  , user         : user
  , key          : key
  , brsrc        : path.join(__dirname, 'browserify.js')
  , capabilities : capabilities
})
```

Then in your *package.json*:

```js
"scripts": {
  "test-local" : "brtapsauce-local test/browserify.js"
  "test"       : "test/sauce.js"
}
```

You can then use `npm test` to execute your tests on SauceLabs or use `npm run-script test-local` to start a local server that you can run local browsers on.

For CI (Travis, Drone.io or other), you just need to set the `SAUCE_USER` and `SAUCE_KEY` environment variables and let `npm test` do its thing.

Be aware that the **first run will take longer** as Sauce-Connect.jar is downloaded if it's not available. Also, the tests run in series due to a limitation in sauce-tap-runner.

## License

**brtapsauce** is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.