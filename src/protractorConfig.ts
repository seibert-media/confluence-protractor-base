import {browser, Config} from "protractor";

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 960;

export {config as protractorConfig};

export let config: Config = {
	baseUrl: "http://confluence:8090/",
	capabilities: {
		// default browser: chrome
		"browserName": "chrome",
		// chrome options
		"chromeOptions": {
			args: ["lang=en-EN", "--window-size=" + SCREEN_WIDTH + "," + SCREEN_HEIGHT, "disable-infobars=true"],
			prefs: {
				credentials_enable_service: false,
				intl: {accept_languages: "en-EN"},
				profile: {
					password_manager_enabled: false,
				},
			},
		},
		// phantomjs options
		"phantomjs.binary.path": require("phantomjs-prebuilt").path,
		"phantomjs.ghostdriver.cli.args": ["--loglevel=DEBUG"],
	},
	framework: "jasmine",
	params: {
		confluenceConfig: "default",
	},
	seleniumAddress: "http://localhost:4444/wd/hub",
	specs: [
		"specs/common/prepareTestSetup.spec.js",
		"specs/*.spec.js",
	],
	onPrepare() {
		// ignoreSynchronization prevents protractor from waiting for angular
		browser.waitForAngularEnabled(false);

		const jasmineEnv = jasmine.getEnv();

		const jasmineReporters = require("jasmine-reporters");
		jasmineEnv.addReporter(new jasmineReporters.JUnitXmlReporter({
			consolidateAll: true,
			filePrefix: "ui-test-results",
		}));

		const screenshotReporter = require("./jasmineReporters/screenshotReporter").screenshotReporter;
		jasmineEnv.addReporter(screenshotReporter);

		const failFastReporter = require("./jasmineReporters/failFastReporter").failFastReporter;
		failFastReporter.init();
		jasmineEnv.addReporter(failFastReporter);

		// log configured timeouts and reset jasmine timeout
		const pageObjectUtils = require("./utils/pageObjectUtils").pageObjectUtils;
		console.log("Initial DEFAULT_ELEMENT_TIMEOUT", pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT);
		console.log("Initial DEFAULT_LOADING_TIMEOUT", pageObjectUtils.DEFAULT_LOADING_TIMEOUT);
		pageObjectUtils.resetJasmineTimeoutForPageObjectTimeouts();

		// set screensize for screenshots and visibilities
		browser.driver.manage().window().setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

		// clean screenshot directory
		pageObjectUtils.cleanScreenshots();

		browser.getCapabilities().then((capabilities) => {
			// turn off alerts for phantomjs
			const browserName = capabilities.get("browserName");

			console.log("browserName: " + browserName);
			if (browserName === "phantomjs") {
				pageObjectUtils.setTurnOffAlerts(true);
			}
		});

		// wait until confluence version is loaded
		const ConfluenceBase = require("./page-objects/ConfluenceBase").ConfluenceBase;
		const confluenceBase = new ConfluenceBase();
		confluenceBase.actions.login.open();

		// initial screenshot
		pageObjectUtils.takeScreenshot("initial-screenshot.png");

		return browser.wait(() => confluenceBase.loadConfluenceVersion().then((confluenceVersion) => {
			console.log("Detected Confluence Version for UI-Tests: ", confluenceVersion);
			return confluenceVersion;
		}));
	},
};
