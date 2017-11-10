import {by, element} from "protractor";
import {ConfluenceEditor} from "../page-objects/ConfluenceEditor";
import {AutocompleteSearch} from "../utils/elements/AutocompleteSearch";
import {pageObjectUtils} from "../utils/pageObjectUtils";

const openPage = pageObjectUtils.openPage;

describe("AutocompleteSearch (page object)", () => {

	const pageEditor = new ConfluenceEditor();

	const AUTOCOMPLETE_TIMEOUT = 45 * 1000;

	beforeAll(() => {
		pageEditor.loginAsAdmin();
	});

	it("adds a comment with a mention", () => {
		openPage("display/ds");

		pageEditor.openComment();

		expect(pageEditor.hasEditor()).toBe(true);

		const mentionAutocomplete = new AutocompleteSearch({
			searchTerm: "user",
			inputElement: pageEditor.editor,
			resultContainer: element(by.css(".autocomplete-mentions")),
		});

		mentionAutocomplete.search({searchPrefix: "@"});

		mentionAutocomplete.waitForResult();
		expect(mentionAutocomplete.foundExpectedResult()).toBe(true);

		mentionAutocomplete.clearAndLeave();

		pageEditor.cancelAndSkipAlert();

		expect(pageEditor.hasEditor()).toBe(false);
	}, AUTOCOMPLETE_TIMEOUT);

});
