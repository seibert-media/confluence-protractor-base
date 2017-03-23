var ConfluencePage = require('../page-objects/ConfluencePage');
var ConfluenceEditor = require('../page-objects/ConfluenceEditor');

var pageObjectUtils = require('../utils/pageObjectUtils');
var openPage = pageObjectUtils.openPage;

describe('ConfluencePage und ConfluenceEditor (page object)', function() {

	var timestamp = new Date().valueOf();
	var uniquePageTitle = 'Test Page - ' + timestamp;
	var uniqueCommentContent = 'Test Comment - ' + timestamp;

	var page = new ConfluencePage(uniquePageTitle, 'ds');
	var pageEditor = new ConfluenceEditor();


	beforeAll(function () {
		pageEditor.authenticateAsAdmin();
	});

	describe('create()', function () {
		beforeAll(function () {
			page.create();
		});

		afterAll(function () {
			browser.getTitle().then(function (pageTitle) {
				if (pageTitle.indexOf(uniquePageTitle) >= 0) {
					page.remove();
				}
			});
		});

		it('closes editor after save', function () {
			pageEditor.waitUntilEditorClosed();

			expect(pageEditor.hasEditor()).toBe(false);
		});

		it('can create a page', function () {
			expect(browser.getTitle()).toContain(uniquePageTitle);
		});
	});

	describe('edit()', function () {
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

		it('opens the editor', function () {
			page.edit();
			expect(pageEditor.hasEditor()).toBe(true);
			page.getEditor().cancel();
			pageEditor.waitUntilEditorClosed();
			expect(pageEditor.hasEditor()).toBe(false);
		});

		describe('discardDraftIfPresent()', function () {
			beforeAll(function () {
				page.edit();
				pageEditor.editor.sendKeys("Some Content");
				pageEditor.cancel();
				pageEditor.waitUntilEditorClosed();
				pageObjectUtils.asyncElement(by.id('editPageLink')).click();
			});

			afterAll(function () {
				pageEditor.cancel();
				pageEditor.waitUntilEditorClosed();
			});

			it('has a draft message', function () {
				pageEditor.waitUntilEditorOpened();
				expect(element(by.id('draft-messages')).isPresent()).toBe(true);
			});

			it('should not has a draft message', function () {
				pageEditor.waitUntilEditorOpened();
				pageEditor.discardDraftIfPresent();
				expect(element(by.id('draft-messages')).isPresent()).toBe(false);
			});
		});
	});


	describe('comments', function () {
		it('are not present before tests', function () {
			expect(pageEditor.hasEditor()).toBe(false);
		});

		it('adds a comment', function () {
			openPage('display/ds');

			pageEditor.openComment();
			pageEditor.editor.sendKeys(uniqueCommentContent);
			pageEditor.save();

			pageEditor.waitUntilEditorClosed();

			expect(page.getLatestCommentContent()).toBe(uniqueCommentContent);
			expect(page.hasComments()).toBe(true);
		});

		it('removes the comment', function () {
			openPage('display/ds');

			page.removeLatestComment();

			expect(page.hasComments()).toBe(false);
		});

		it('cancels a comment', function () {
			openPage('display/ds');

			pageEditor.openComment();

			expect(pageEditor.hasEditor()).toBe(true);

			pageEditor.editor.sendKeys('Some content');

			pageEditor.cancelAndClear();

			expect(pageEditor.hasEditor()).toBe(false);
		});
	})
});
