import {by, element} from "protractor";
import {ConfluenceEditor} from "../page-objects/ConfluenceEditor";
import {AutocompleteSearch} from "../utils/elements/AutocompleteSearch";
import {pageObjectUtils} from "../utils/pageObjectUtils";

const openPage = pageObjectUtils.openPage;

describe("AutocompleteSearch (page object)", () => {

	const pageEditor = new ConfluenceEditor();

	const AUTOCOMPLETE_TIMEOUT = 45 * 1000;

	const mentionAutocomplete = new AutocompleteSearch({
		searchTerm: "user",
		inputElement: pageEditor.editor,
		resultContainer: element(by.css(".autocomplete-mentions")),
	});

	beforeAll(() => {
		pageEditor.loginAsAdmin();
	});

	it("opens comments", () => {
		openPage("display/ds");

		pageEditor.openComment();

		expect(pageEditor.hasEditor()).toBe(true);
	});

	it("adds a mention", () => {
		mentionAutocomplete.search({searchPrefix: "@"});

		mentionAutocomplete.waitForMatchingResult();

		expect(mentionAutocomplete.foundExpectedResult()).toBe(true);
	}, AUTOCOMPLETE_TIMEOUT);

	it("closes comment", () => {
		mentionAutocomplete.clearAndLeave();

		pageEditor.cancelAndSkipAlert();

		expect(pageEditor.hasEditor()).toBe(false);
	});

});
