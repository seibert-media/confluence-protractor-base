var remote = require('selenium-webdriver/remote');
var path = require('path');
var ConfluenceBase = require('./ConfluenceBase');
var ConfluenceAction = require('./ConfluenceAction');
var pageObjectUtils = require('../utils/pageObjectUtils');
var clickIfPresent = pageObjectUtils.clickIfPresent;
var asyncElement = pageObjectUtils.asyncElement;
var waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;
var takeScreenshot = pageObjectUtils.takeScreenshot;

function UniversalPluginManager() {
	browser.setFileDetector(new remote.FileDetector());

	var self = this;
	var EC = protractor.ExpectedConditions;
	var DEFAULT_PLUGIN_UPLOAD_TIMEOUT = 60 * 1000;
	var DEFAULT_UPM_LOADING_TIME = 20 * 1000;
	var UPLOAD_BUTTON_VISIBILITY_TIMEOUT = 5000;
	var DEFAULT_MAX_ATTEMPTS = 2;

	this.actions.upm = new ConfluenceAction({
		path: 'plugins/servlet/upm'
	});

	function uploadPluginInternal(pluginName, fileToUpload, timeout, maxAttempts, attemptCount) {
		timeout = timeout || DEFAULT_PLUGIN_UPLOAD_TIMEOUT;

		maxAttempts = maxAttempts || 1;
		attemptCount = attemptCount || 0;

		skipNotifications();

		self.actions.upm.open({refreshAlways: true});

		// open upload dialog
		var uploadButton = asyncElement(by.id('upm-upload'));
		waitForElementToBeClickable(uploadButton, UPLOAD_BUTTON_VISIBILITY_TIMEOUT);
		uploadButton.click();

		// get path and upload plugin
		var absolutePath = path.resolve(process.cwd(), fileToUpload);
		// check if file exists
		require('fs').accessSync(absolutePath);

		asyncElement(by.id('upm-upload-file')).sendKeys(absolutePath);

		// try upload buttons for different confluence versions
		clickIfPresent(asyncElement(by.css('button.confirm')));
		clickIfPresent(asyncElement(by.css('button.upm-upload-plugin-submit')));


		var pluginNameElement = element(by.css('.plugin-name'));
		var pluginInstalledCondition = EC.visibilityOf(pluginNameElement);
		var pluginInstallFailCondition = EC.visibilityOf(element(by.css('.aui-message.error')));

		browser.wait(EC.or(pluginInstalledCondition, pluginInstallFailCondition)).then(function () {
			if (attemptCount < maxAttempts) {
				pluginInstallFailCondition().then(function (installFailed) {
					if (installFailed) {
						uploadPluginInternal(pluginName, fileToUpload, timeout, maxAttempts, attemptCount + 1);
					}
				});
			}

			// try confirm buttons for different confluence versions
			clickIfPresent(asyncElement(by.css('button.confirm')));
			clickIfPresent(asyncElement(by.css('button.button-panel-cancel-link')));
		});
	}

	function skipNotifications() {
		self.openAdminPage('admin/viewgeneralconfig.action');

		// beware "ugly" workaround to make sure notifications are loaded
		browser.sleep(5000);
		takeScreenshot('skip-notifications.png');

		// dismiss all notifications if any occur
		asyncElement.all(by.css('.dismiss-notification')).each(function(notification) {
			console.log('skipped notification');
			clickIfPresent(notification);
		});
	}

	function pluginEntrySelector(pluginKey) {
		return '.upm-plugin[data-key="' + pluginKey + '"]';
	}

	this.pluginInstalled = function (pluginName) {
		self.actions.upm.open({refreshAlways: true});

		element(by.id('upm-manage-filter-box')).sendKeys(pluginName);

		browser.wait(EC.visibilityOf(element(by.css('.upm-plugin-list-container'))), DEFAULT_UPM_LOADING_TIME);

		var pluginNameElement = pageObjectUtils.findFirstDisplayed(by.css('.upm-plugin-name'));

		return EC.textToBePresentInElement(pluginNameElement, pluginName)();
	};

	this.uploadPlugin = function (pluginName, fileToUpload, timeout, maxAttempts) {
		uploadPluginInternal(pluginName, fileToUpload, timeout, maxAttempts || DEFAULT_MAX_ATTEMPTS, 1);
	};

	this.uninstallPlugin = function (pluginKey) {
		this.pluginInstalled(pluginKey).then(function (isPluginInstalled) {
			if (isPluginInstalled) {
				pageObjectUtils.findFirstDisplayed(by.css('.upm-plugin')).click();

				if (self.confluenceVersion().greaterThan('5.8')) {
					asyncElement(by.css('[data-action="UNINSTALL"]')).click();
					clickIfPresent(asyncElement(by.css('button.confirm')));
				} else {
					var uninstallButton = element(by.css('.upm-uninstall'));
					browser.wait(EC.visibilityOf(uninstallButton));
					uninstallButton.click();
					clickIfPresent(asyncElement(by.css('#upm-confirm-dialog .button-panel-button')));
				}
			}
		});
	};

	this.parseMavenVersionFromPom = function () {
		var mavenCommand = 'atlas-mvn org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate  -Dexpression=project.version -B';
		var mavenVersionOutput = require('child_process').execSync(mavenCommand, {
			encoding: 'utf-8',
			stdio: [0]
		});

		var mavenVersionLine = mavenVersionOutput.split('\n').filter(function (outputLine) {
			// expect version line to match number and dot "1."
			return /^\d+\..*$/.test(outputLine.trim());
		});

		if (mavenVersionLine.length !== 1) {
			throw new Error('Expected one line of maven output to be the version but found ' + mavenVersionLine.length)
		}

		return mavenVersionLine[0].trim();
	};

}

UniversalPluginManager.prototype = new ConfluenceBase();

module.exports = UniversalPluginManager;

