
// ignoreSynchronization prevents protractor from waiting for angular
browser.ignoreSynchronization = true;

var confluenceConfigModule = './config/' + browser.params.confluenceConfig;
var confluenceConfig = require(confluenceConfigModule);

module.exports = confluenceConfig;
