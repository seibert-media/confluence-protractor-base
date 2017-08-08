var SCREEN_WIDTH = 1280;
var SCREEN_HEIGHT = 960;

// conf.js
exports.config = {
	baseUrl: 'http://confluence:8090/',
	capabilities: {
		// default browser: chrome
		'browserName': 'chrome',
		// chrome options
		'chromeOptions': {
			args: [ 'lang=en-EN', '--window-size=' + SCREEN_WIDTH + ',' + SCREEN_HEIGHT],
			prefs: {
				intl: { accept_languages: "en-EN" },
				'credentials_enable_service': false,
				'profile': {
					'password_manager_enabled': false
				}
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
	specs: [
		'specs/common/prepareTestSetup.spec.js',
		'specs/*.spec.js'
	],
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

		var failFastReporter = require('./jasmineReporters/failFastReporter');
		failFastReporter.init();
		jasmineEnv.addReporter(failFastReporter);

		// log configured timeouts and reset jasmine timeout
		var pageObjectUtils = require('./utils/pageObjectUtils');
		console.log('Initial DEFAULT_ELEMENT_TIMEOUT', pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT);
		console.log('Initial DEFAULT_LOADING_TIMEOUT', pageObjectUtils.DEFAULT_LOADING_TIMEOUT);
		pageObjectUtils.resetJasmineTimeoutForPageObjectTimeouts();

		// set screensize for screenshots and visibilities
		browser.driver.manage().window().setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

		// clean screenshot directory
		pageObjectUtils.cleanScreenshots();

		browser.getCapabilities().then(function (capabilities) {
			// turn off alerts for phantomjs
			var browserName = capabilities.get('browserName');

			console.log('browserName: ' + browserName);
			if (browserName === 'phantomjs') {
				pageObjectUtils.setTurnOffAlerts(true);
			}
		});

		// wait until confluence version is loaded
		var ConfluenceBase = require('./page-objects/ConfluenceBase');
		var confluenceBase = new ConfluenceBase();
		confluenceBase.actions.login.open();

		// initial screenshot
		pageObjectUtils.takeScreenshot('initial-screenshot.png');

		return browser.wait(function () {
			return confluenceBase.loadConfluenceVersion().then(function (confluenceVersion) {
				console.log('Detected Confluence Version for UI-Tests: ', confluenceVersion);
				return confluenceVersion;
			});
		});
	}
};
