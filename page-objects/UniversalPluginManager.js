var remote = require('selenium-webdriver/remote');
var path = require('path');
var ConfluenceBase = require('./ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');
var assert = pageObjectUtils.assert;
var clickIfPresent = pageObjectUtils.clickIfPresent;
var asyncElement = pageObjectUtils.asyncElement;

browser.setFileDetector(new remote.FileDetector());

function UniversalPluginManager() {
	var self = this;
	var DEFAULT_PLUGIN_UPLOAD_TIMEOUT = 60000;
	var UPLOAD_BUTTON_VISIBILITY_TIMEOUT = 5000;

	this.uploadPlugin = function (pluginName, fileToUpload, timeout) {
		timeout = timeout || DEFAULT_PLUGIN_UPLOAD_TIMEOUT;

		self.authenticateAsAdmin();

		browser.get('/plugins/servlet/upm');

		// dismiss up to three notifications if they occur
		clickIfPresent(asyncElement(by.css('.dismiss-notification')));
		clickIfPresent(asyncElement(by.css('.dismiss-notification')));
		clickIfPresent(asyncElement(by.css('.dismiss-notification')));

		// open upload dialog
		var uploadButton = asyncElement(by.id('upm-upload'));
		browser.wait(protractor.ExpectedConditions.visibilityOf(uploadButton, UPLOAD_BUTTON_VISIBILITY_TIMEOUT));
		uploadButton.click();

		// get path and upload plugin
		var absolutePath = path.resolve(process.cwd(), fileToUpload);
		// check if file exists
		require('fs').accessSync(absolutePath);
		console.log('Plugin path: ' + absolutePath);
		asyncElement(by.id('upm-upload-file')).sendKeys(absolutePath);

		// try upload buttons for different confluence versiions
		clickIfPresent(asyncElement(by.css('button.confirm')));
		clickIfPresent(asyncElement(by.css('button.upm-upload-plugin-submit')));

		// check and wait for plugin name
		var $pluginName = asyncElement(by.css('.plugin-name'), timeout);

		assert($pluginName.getText(), pluginName, 'Plugin name not found');

		// try confirm buttons for different confluence versiions
		clickIfPresent(asyncElement(by.css('button.confirm')));
		clickIfPresent(asyncElement(by.css('button.button-panel-cancel-link')));
	};

	this.parseMavenVersionFromPom = function () {
		var mavenVersionOutput = require('child_process').execSync('mvn org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate  -Dexpression=project.version -B', {
			encoding: 'utf-8',
			stdio: [0]
		});

		var mavenVersion = mavenVersionOutput.replace(/^(\[|Java).*(\n|$)/gm, '').trim();
		return mavenVersion;
	};

}

UniversalPluginManager.prototype = new ConfluenceBase();

module.exports = UniversalPluginManager;

