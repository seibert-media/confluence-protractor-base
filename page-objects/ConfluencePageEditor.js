var ConfluenceBase = require('./ConfluenceBase');

var pageObjectUtils = require('../utils/pageObjectUtils');

var asyncElement = pageObjectUtils.asyncElement;
var openPage = pageObjectUtils.openPage;
var skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;

var DEFAULT_ELEMENT_TIMEOUT = pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT;

function ConfluencePageEditor() {
	var self = this;

	this.createNewPageWithTitle = function(pageTitle) {
		openPage();

		element(by.id('create-page-button')).click();

		asyncElement((by.css('.templates .template')));

		element.all(by.css('.templates .template .template-name')).first().click();

		element(by.css('button.create-dialog-create-button')).click();

		element(by.id('content-title')).sendKeys(pageTitle);
	};

	this.addContent = function(content) {
		browser.switchTo().frame(asyncElement(by.id('wysiwygTextarea_ifr')).getWebElement());

		asyncElement(by.id('tinymce')).sendKeys(content);

		browser.switchTo().defaultContent();
	};



	this.save = function () {
		asyncElement(by.id('rte-button-publish')).click();
	};

	this.cancel = function () {
		asyncElement(by.id('rte-button-cancel')).click();

		skipAlertIfPresent();
	};

	this.openComment = function () {
		element.all(by.css('.quick-comment-prompt')).first().click();
	};

	this.addComment = function (comment) {
		this.openComment();
		this.addContent(comment);
		this.save();

		browser.sleep(DEFAULT_ELEMENT_TIMEOUT);
	};

	this.openActionMenu = function () {
		element(by.id('action-menu-link')).click();
	};

	this.deletePage = function () {
		this.openActionMenu();

		asyncElement(by.id('action-remove-content-link')).click();

		asyncElement(by.id('confirm')).click();
	};

	this.getPageTitle = function () {
		return element(by.id('title-text')).getText();
	};

	this.getLatestComment = function () {
		return element.all(by.css('#page-comments .comment')).last();
	};

	this.getLatestCommentContent = function () {
		return this.getLatestComment().element(by.css('.comment-content')).getText();
	};

	this.removeLatestComment = function () {
		this.getLatestComment().element(by.css('.comment-action-remove')).click();

		skipAlertIfPresent();
	};

}

ConfluencePageEditor.prototype = new ConfluenceBase();

module.exports = ConfluencePageEditor;
