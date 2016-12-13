var ConfluenceBase = require('./ConfluenceBase');

var assert = confluenceProtractorBase.utils.pageObjectUtils.assert;

function waitUntilElementPresent(element) {
	browser.wait(function() {
		return browser.isElementPresent(element);
	});
}

function ConfluencePageEditor() {
	var self = this;

	this.createNewPageWithTitle = function(pageTitle) {
		browser.get('/');

		element(by.id('create-page-button')).click();

		waitUntilElementPresent(element(by.css('.templates .template')));
		element.all(by.css('.templates .template .template-name')).first().click();

		element(by.css('button.create-dialog-create-button')).click();

		element(by.id('content-title')).sendKeys(pageTitle);
	};

	this.addPageContent = function(content) {
		browser.switchTo().frame(element(by.id('wysiwygTextarea_ifr')).getWebElement());

		element(by.id('tinymce')).sendKeys(content);
	}

}

ConfluencePageEditor.prototype = new ConfluenceBase();

module.exports = ConfluenceEditor;
