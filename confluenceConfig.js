
// ignoreSynchronization prevents protractor from waiting for angular
browser.ignoreSynchronization = true;

var confluenceConfig;

if (typeof browser.params.confluenceConfig === 'string') {
	var confluenceConfigModule = './config/' + browser.params.confluenceConfig;
	confluenceConfig = require(confluenceConfigModule);
}
else if (typeof browser.params.confluenceConfig === 'object') {
	confluenceConfig = browser.params.confluenceConfig;
}
else {
	throw new Error('No valid confluenceConfig parameter in protractor config: ', browser.params.confluenceConfig);
}

console.log('confluenceConfig: ', confluenceConfig);

module.exports = confluenceConfig;

