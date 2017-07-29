# Confluence Protractor Base
The Confluence&reg; Protractor Base is a simple solution to implement und run UI tests for [Atlassian&reg; Confluence&reg;](https://www.atlassian.com/software/confluence).
It provides basic functionality like creating pages, spaces, users and groups as well as login, authenticate as admin and open pages.  

# Local setup
To start up local UI tests, you need the following setup
- [protractor](http://www.protractortest.org)
- a running Confluence&reg; instance

## Steps to run UI tests
There has to be UI tests in your project
1. Start a clean [Confluence&reg; docker instance](https://hub.docker.com/r/atlassian/confluence-server/)
   - The instance should be locally available under <http://confluence:8090>\
     (!) Note: There may be changes needed in the `/etc/hosts` file `127.0.0.1      confluence`
1. Setup required resources
   1. Run `npm install` in your plugin project, after that, there should be runnable programs inside `node_modules/.bin`
   1. Update `webdriver-manager` once with `node_modules/.bin/webdriver-manager update`
   1. Start `webdriver-manager` in another console using `node_modules/.bin/webdriver-manager start`
1. Run UI tests with an npm script using `npm run test-e2e` (e2e means End-to-End)

# Troubleshooting
## phantom.js
```text
error while loading shared libraries: libicui18n.so.52: cannot open shared object file: No such file or directory
```
On Ubuntu 16.04 this solved the issue: <https://github.com/Pyppe/phantomjs2.0-ubuntu14.04x64/issues/1#issuecomment-244120878>

## WebDriverJS
```text
run 'webdriver-manager update'.The cmd show 'SyntaxError: Unexpected token ...' #4001
```
See https://github.com/angular/protractor/issues/4001.

```text
node_modules\webdriver-manager\built\lib\cli\logger.js:66
    info(...msgs) {
         ^^^
SyntaxError: Unexpected token ...
    at exports.runInThisContext (vm.js:53:16)
    at Module._compile (module.js:404:25)
    at Object.Module._extensions..js (module.js:432:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:313:12)
    at Module.require (module.js:366:17)
    at require (module.js:385:17)
    at Object.<anonymous> (C:\Users\wuyang\AppData\Roaming\npm\node_modules\protractor\node_modules\webdriver-manager\built\
lib\cli\index.js:8:10)
    at Module._compile (module.js:425:26)
    at Object.Module._extensions..js (module.js:432:10)
```

Update Node and npm (for Ubuntu 16.04 Node 7.6.0 and npm 4.1.2 worked).
