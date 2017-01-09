var ConfluenceBase = require('./ConfluenceBase');

var pageObjectUtils = require('../utils/pageObjectUtils');

var asyncElement = pageObjectUtils.asyncElement;
var openPage = pageObjectUtils.openPage;
var skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;

var DEFAULT_ELEMENT_TIMEOUT = pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT;

function ConfluencePageEditor() {
	var self = this;

	this.createNewPageWithTitle = function(pageTitle, spaceKey) {
		spaceKey = spaceKey || 'ds';

		openPage('pages/createpage.action?spaceKey=' + spaceKey);

		element(by.id('content-title')).sendKeys(pageTitle);
	};

	this.getEditorFrame = function () {
		return asyncElement(by.id('wysiwygTextarea_ifr'));
	};


	this.executeInEditorContext = function (fn) {
		browser.switchTo().frame(this.getEditorFrame().getWebElement());

		var fnResult = fn(asyncElement(by.id('tinymce')));

		browser.switchTo().defaultContent();

		return fnResult;
	};

	this.addContent = function(content) {
		this.executeInEditorContext(function (editorInput) {
			editorInput.sendKeys(content);
		});
	};

	this.clearContent = function() {
		this.executeInEditorContext(function (editorInput) {
			editorInput.clear();
		});
	};

	this.save = function () {
		asyncElement(by.id('rte-button-publish')).click();
	};

	this.cancel = function () {
		asyncElement(by.id('rte-button-cancel')).click();
	};

	this.cancelAndSkripAlert = function () {
		this.cancel();
		skipAlertIfPresent();
	};

	this.cancelAndClear = function () {
		this.clearContent();
		this.cancel();
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
