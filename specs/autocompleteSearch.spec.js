var ConfluencePageEditor = require('../page-objects/ConfluencePageEditor');
var AutocompleteSearch = require('../utils/elements/AutocompleteSearch');

var pageObjectUtils = require('../utils/pageObjectUtils');
var openPage = pageObjectUtils.openPage;

describe('AutocompleteSearch (page object)', function() {

	var pageEditor = new ConfluencePageEditor();

	beforeAll(function () {
		pageEditor.authenticateAsAdmin();
	});

	it('adds a comment with a mention', function () {
		openPage('display/ds');

		pageEditor.openComment();

		var mentionAutocomplete = new AutocompleteSearch({
			searchTerm: 'Adara',
			inputElement: pageEditor.editor,
			resultContainer: element(by.css('.autocomplete-mentions'))
		});

		mentionAutocomplete.search({searchPrefix: '@'});

		expect(pageEditor.hasEditor()).toBe(true);

		mentionAutocomplete.waitForResult();
		expect(mentionAutocomplete.foundExpectedResult()).toBe(true);

		mentionAutocomplete.clearAndLeave();

		pageEditor.cancelAndSkipAlert();

		expect(pageEditor.hasEditor()).toBe(false);
	});

});
