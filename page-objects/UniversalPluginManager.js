var path = require('path');
var ConfluenceBase = require('./ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');
var assert = pageObjectUtils.assert;
var clickIfPresent = pageObjectUtils.clickIfPresent;

function UniversalPluginManager() {
	var self = this;
	var DEFAULT_PLUGIN_UPLOAD_TIMEOUT = 60000;
	var UPLOAD_BUTTON_VISIBILITY_TIMEOUT = 5000;

	this.uploadPlugin = function (pluginName, fileToUpload, timeout) {
		timeout = timeout || DEFAULT_PLUGIN_UPLOAD_TIMEOUT;

		self.authenticateAsAdmin();

		browser.get('/plugins/servlet/upm');

		// dismiss up to three notifications if they occur
		clickIfPresent(element(by.css('.dismiss-notification')));
		clickIfPresent(element(by.css('.dismiss-notification')));
		clickIfPresent(element(by.css('.dismiss-notification')));

		// open upload dialog
		var uploadButton = element(by.id('upm-upload'));
		browser.wait(protractor.ExpectedConditions.visibilityOf(uploadButton, UPLOAD_BUTTON_VISIBILITY_TIMEOUT));
		uploadButton.click();

		// get path and upload plugin
		var absolutePath = path.resolve(process.cwd(), fileToUpload);
		// check if file exists
		require('fs').accessSync(absolutePath);
		console.log('Plugin path: ' + absolutePath);
		element(by.id('upm-upload-file')).sendKeys(absolutePath);

		// try upload buttons for different confluence versiions
		clickIfPresent(element(by.css('button.confirm')));
		clickIfPresent(element(by.css('button.upm-upload-plugin-submit')));

		// check and wait for plugin name
		var $pluginName = element(by.css('.plugin-name'));
		browser.wait(function() {
			return browser.isElementPresent($pluginName);
		}, timeout);
		assert($pluginName.getText(), pluginName, 'Plugin name not found');

		// try confirm buttons for different confluence versiions
		clickIfPresent(element(by.css('button.confirm')));
		clickIfPresent(element(by.css('button.button-panel-cancel-link')));
	};

	this.parseMavenVersionFromPom = function () {
			var mavenVersionOutput = require('child_process').execSync('atlas-mvn org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate  -Dexpression=project.version -B', {
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

