var ConfluencePage = require('../page-objects/ConfluencePage');
var ConfluenceEditor = require('../page-objects/ConfluenceEditor');
var ConfluenceMacroBrowser = require('../page-objects/ConfluenceMacroBrowser');

var pageObjectUtils = require('../utils/pageObjectUtils');
var DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

describe('ConfluenceMacroBrowser (page object)', function() {
	var timestamp = new Date().valueOf();
	var uniquePageTitle = 'Test Page - ' + timestamp;

	var page = new ConfluencePage(uniquePageTitle, 'ds');
	var pageEditor = new ConfluenceEditor();
	var macroBrowser = new ConfluenceMacroBrowser("Info", "info");

	beforeAll(function () {
		pageEditor.authenticateAsAdmin();
	});

	describe('insertMacroViaBracket()', function () {
		beforeAll(function () {
			page.create();
			pageEditor.waitUntilEditorClosed();
		});

		afterAll(function () {
			browser.getTitle().then(function (pageTitle) {
				if (pageTitle.indexOf(uniquePageTitle) >= 0) {
					page.remove();
				}
			});
		});

		it('inserts Macro', function () {
			page.edit();
			pageEditor.waitUntilEditorOpened();

			macroBrowser.insertMacroViaBracket();

			macroBrowser.getMacroElement().then(function(macro) {
				// browser.wait(macro.isPresent(), DEFAULT_LOADING_TIMEOUT);

				page.getEditor().executeInEditorContext(function() {
					expect(macro.isPresent()).toBe(true);
				});

				pageEditor.cancel();
				pageEditor.waitUntilEditorClosed();
			});

		});
	});

});
