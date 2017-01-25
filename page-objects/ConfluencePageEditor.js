var ConfluenceBase = require('./ConfluenceBase');

var pageObjectUtils = require('../utils/pageObjectUtils');

var asyncElement = pageObjectUtils.asyncElement;
var openPage = pageObjectUtils.openPage;
var skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;

function ConfluencePageEditor() {
	var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;
	var DEFAULT_ELEMENT_TIMEOUT = pageObjectUtils.DEFAULT_ELEMENT_TIMEOUT;

	var EC = protractor.ExpectedConditions;
	var self = this;

	this.createNewPageWithTitle = function(pageTitle, spaceKey) {
		spaceKey = spaceKey || 'ds';

		openPage('pages/createpage.action?spaceKey=' + spaceKey);

		element(by.id('content-title')).sendKeys(pageTitle);
	};

	this.getEditorFrame = function () {
		return element(by.id('wysiwygTextarea_ifr'));
	};

	this.hasEditor = function () {
		return this.getEditorFrame().isPresent();
	};

	this.waitUntilEditorOpened = function () {
		return browser.wait(this.hasEditor.bind(this), DEFAULT_LOADING_TIMEOUT);
	};

	this.waitUntilEditorClosed = function() {
		return browser.wait(EC.not(this.hasEditor.bind(this)), DEFAULT_LOADING_TIMEOUT);
	};

	// fake input element methods to use page editor for Autocomplete components
	this.editor = {
		extendResult: function (result) {
			result.clear = this.clear;
			result.sendKeys = this.sendKeys;
			return result;
		},
		clear: function () {
			return self.executeInEditorContext(function (editorInput) {
				return self.editor.extendResult(editorInput.clear());
			});
		},
		sendKeys: function (keys) {
			return self.executeInEditorContext(function (editorInput) {
				return self.editor.extendResult(editorInput.sendKeys(keys));
			});
		}
	};

	this.executeInEditorContext = function (fn) {
		this.waitUntilEditorOpened();

		browser.switchTo().frame(this.getEditorFrame().getWebElement());

		var fnResult = fn(asyncElement(by.id('tinymce')));

		browser.switchTo().defaultContent();

		return fnResult;
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
		this.waitUntilEditorClosed();
	};

	this.cancelAndClear = function () {
		this.editor.clear();
		this.cancel();
		this.waitUntilEditorClosed();
	};

	this.openComment = function () {
		element.all(by.css('.quick-comment-prompt')).first().click();
		this.waitUntilEditorOpened();
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

	this.getComments = function () {
		return element.all(by.css('#page-comments .comment'));
	};

	this.hasComments = function () {
		return this.getComments().count().then(function (count) {
			return count > 0;
		});
	};

	this.getLatestComment = function () {
		return this.getComments().last();
	};

	this.getLatestCommentContent = function () {
		return this.getLatestComment().element(by.css('.comment-content')).getText();
	};

	this.removeLatestComment = function () {
		var latestComment = this.getLatestComment();
		latestComment.element(by.css('.comment-action-remove')).click();

		skipAlertIfPresent();

		browser.wait(EC.stalenessOf(latestComment), DEFAULT_ELEMENT_TIMEOUT);
	};

}

ConfluencePageEditor.prototype = new ConfluenceBase();

module.exports = ConfluencePageEditor;
