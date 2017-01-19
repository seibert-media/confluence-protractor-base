var ConfluencePageEditor = require('../page-objects/ConfluencePageEditor');

var pageObjectUtils = require('../utils/pageObjectUtils');
var openPage = pageObjectUtils.openPage;
var asyncElement = pageObjectUtils.asyncElement;

describe('ConfluencePageEditor (page object)', function() {

	var pageEditor = new ConfluencePageEditor();

	var timestamp = new Date().valueOf();
	var uniquePageTitle = 'Test Page - ' + timestamp;
	var uniqueCommentContent = 'Test Comment - ' + timestamp;

	beforeAll(function () {
		pageEditor.authenticateAsAdmin();
	});

	describe('createNewPageWithTitle()', function () {
		beforeAll(function () {
			pageEditor.createNewPageWithTitle(uniquePageTitle);
			expect(pageEditor.hasEditor()).toBe(true);

			pageEditor.save();
		});

		afterAll(function () {
			pageEditor.getPageTitle().then(function (pageTitle) {
				if (pageTitle === uniquePageTitle) {
					pageEditor.deletePage();
				}
			});
		});

		it('closes editor after save', function () {
			pageEditor.waitUntilEditorClosed();

			expect(pageEditor.hasEditor()).toBe(false);
		});

		it('can create a page', function () {
			expect(pageEditor.getPageTitle()).toBe(uniquePageTitle);
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

			expect(pageEditor.getLatestCommentContent()).toBe(uniqueCommentContent);
			expect(pageEditor.hasComments()).toBe(true);
		});

		it('removes the comment', function () {
			openPage('display/ds');

			pageEditor.removeLatestComment();

			expect(pageEditor.hasComments()).toBe(false);
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
