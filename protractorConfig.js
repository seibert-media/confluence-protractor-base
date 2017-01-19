// conf.js
exports.config = {
	baseUrl: 'http://localhost:8090/',
	capabilities: {
		// default browser: chrome
		'browserName': 'chrome',
		// chrome options
		'chromeOptions': {
			args: [ 'lang=en-EN', '--window-size=' + SCREEN_WIDTH + ',' + SCREEN_HEIGHT],
			prefs: {
				intl: { accept_languages: "en-EN" }
			}
		},
		// phantomjs options
		'phantomjs.binary.path': require('phantomjs-prebuilt').path,
		'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
	},
	params: {
		confluenceConfig: 'default'
	},
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['specs/*.spec.js'],
	onPrepare: function() {
		// ignoreSynchronization prevents protractor from waiting for angular
		browser.ignoreSynchronization = true;

		var jasmineEnv = jasmine.getEnv();

		var jasmineReporters = require('jasmine-reporters');
		jasmineEnv.addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			filePrefix: 'ui-test-results'
		}));

		var screenshotReporter = require('./jasmineReporters/screenshotReporter');
		jasmineEnv.addReporter(screenshotReporter);

		/**
		 * Workaround for race condition
		 *
		 * Github Issue: https://github.com/angular/protractor/issues/3777
		 * Reproduction test: https://github.com/tilmanpotthof/race-condition-in-expected-condition-visibility-of
		 */
		var saveExpectedConditions = require('protractor-save-expected-conditions');
		protractor.ExpectedConditions.visibilityOf = saveExpectedConditions.saveVisibilityOf;
		protractor.ExpectedConditions.textToBePresentInElement = saveExpectedConditions.saveTextToBePresentInElement;

		// log confligured timeouts and reset jasmine timeout
		var pageObjectUtils = require('./utils/pageObjectUtils');
		console.log('Initial DEFAULT_ELEMENT_TIMEOUT', pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT);
		console.log('Initial DEFAULT_LOADING_TIMEOUT', pageObjectUtils.DEFAULT_LOADING_TIMEOUT);
		pageObjectUtils.resetJasmineTimeoutForPageObjectTimeouts();

		// wait until confluence version is loaded
		var ConfluenceBase = require('./page-objects/ConfluenceBase');
		var confluenceBase = new ConfluenceBase();
		confluenceBase.actions.login.open();
		return browser.wait(function () {
			return confluenceBase.loadConfluenceVersion().then(function (confluenceVersion) {
				console.log('Detected Confluence Version for UI-Tests: ', confluenceVersion);
				return confluenceVersion;
			});
		});
	}
};
