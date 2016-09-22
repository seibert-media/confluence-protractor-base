var path = require('path');
var ConfluenceBase = require('./ConfluenceBase');
var pageObjectUtils = require('../utils/pageObjectUtils');
var assert = pageObjectUtils.assert;
var clickIfPresent = pageObjectUtils.clickIfPresent;

function UniversalPluginManager() {
	var self = this;

	this.uploadPlugin = function (pluginName, fileToUpload, timeout) {
		timeout = timeout || 60000;

		self.authenticateAsAdmin();

		browser.get('/plugins/servlet/upm');

		// dismiss up to three notifications if they occur
		clickIfPresent(element(by.css('.dismiss-notification')));
		clickIfPresent(element(by.css('.dismiss-notification')));
		clickIfPresent(element(by.css('.dismiss-notification')));

		// open upload dialog
		element(by.id('upm-upload')).click();

		// get path and upload plugin
		var absolutePath = path.resolve(process.cwd(), fileToUpload);
		console.log('Plugin path: ' + absolutePath);
		element(by.id('upm-upload-file')).sendKeys(absolutePath);

		// try upload buttons for different confluence versiions
		clickIfPresent(element(by.css('button.confirm')));
		clickIfPresent(element(by.css('button.upm-upload-plugin-submit')));

		// wait for
		var $pluginName = element(by.css('.plugin-name'));

		browser.wait(function() {
			return browser.isElementPresent($pluginName);
		}, timeout);


		assert($pluginName.getText(), pluginName, 'Plugin name not found');

		clickIfPresent(element(by.css('button.confirm')));
		clickIfPresent(element(by.css('button.button-panel-cancel-link')));
	}

}

UniversalPluginManager.prototype = new ConfluenceBase();

module.exports = UniversalPluginManager;

