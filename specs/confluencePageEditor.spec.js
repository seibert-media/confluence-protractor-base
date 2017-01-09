var ConfluencePageEditor = require('../page-objects/ConfluencePageEditor');

var pageObjectUtils = require('../utils/pageObjectUtils');
var openPage = pageObjectUtils.openPage;
var asyncElement = pageObjectUtils.asyncElement;

fdescribe('ConfluencePageEditor (page object)', function() {

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
			pageEditor.save();
		});

		afterAll(function () {
			pageEditor.getPageTitle().then(function (pageTitle) {
				if (pageTitle === uniquePageTitle) {
					pageEditor.deletePage();
				}
			});
		});

		it('can create a page', function () {
			expect(pageEditor.getPageTitle()).toBe(uniquePageTitle);
		});
	});


	it('adds a comment', function () {
		openPage('display/ds');

		pageEditor.addComment(uniqueCommentContent);

		expect(pageEditor.getLatestCommentContent()).toBe(uniqueCommentContent);
	});

	it('removes the comment', function () {
		openPage('display/ds');

		pageEditor.removeLatestComment();

		expect(pageEditor.getLatestCommentContent()).not.toBe(uniqueCommentContent);
	});

	it('adds a comment with a mention', function () {
		openPage('display/ds');

		pageEditor.openComment();
		pageEditor.addContent('@Adara');

		var mentionSelector = asyncElement(by.css('.autocomplete-mentions [title="Adara Moss (Adara.Moss)"]'));
		expect(mentionSelector.isPresent()).toBe(true);

		pageEditor.cancel();
	});
});
