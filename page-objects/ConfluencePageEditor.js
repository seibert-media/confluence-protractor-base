var ConfluenceBase = require('./ConfluenceBase');

var pageObjectUtils = require('../utils/pageObjectUtils');

var asyncElement = pageObjectUtils.asyncElement;
var skipAlertIfPresent = pageObjectUtils.skipAlertIfPresent;

function ConfluencePageEditor() {
	var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

	var EC = protractor.ExpectedConditions;
	var self = this;

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

	this.cancelAndSkipAlert = function () {
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

}

ConfluencePageEditor.prototype = new ConfluenceBase();

module.exports = ConfluencePageEditor;
