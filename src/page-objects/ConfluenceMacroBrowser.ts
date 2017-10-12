import {by, element, ElementFinder} from "protractor";
import {Locator} from "protractor/built/locators";
import {promise} from "selenium-webdriver";
import {AutocompleteSearch} from "../utils/elements/AutocompleteSearch";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceEditor} from "./ConfluenceEditor";

const asyncElement = pageObjectUtils.asyncElement;

export class ConfluenceMacroBrowser {

	public macroName: string;
	public dataMacroName: string;

	public pageEditor: ConfluenceEditor = new ConfluenceEditor();
	public macroLocator: Locator = by.css('[data-macro-name="' + this.dataMacroName + '"]');

	/**
	 *
	 * @param macroName Name of macro in UI
	 * @param dataMacroName Name of macro that is used in the macro's data attribute in DOM
	 * @constructor
	 */
	constructor(macroName: string, dataMacroName: string) {
		this.macroName = macroName;
		this.dataMacroName = dataMacroName;

		pageObjectUtils.assertNotNull(this.macroName, 'First param "macroName" must be set');
		pageObjectUtils.assertNotNull(this.dataMacroName, 'First param "dataMacroName" must be set');
	}

	public insertMacroViaBracket() {
		const macroAutocomplete = new AutocompleteSearch({
			searchTerm: this.macroName,
			inputElement: this.pageEditor.editor,
			resultContainer: element(by.css(".autocomplete-macros")),
		});

		macroAutocomplete
			.search({searchPrefix: "{", skipClear: true})
			.waitForMatchingResult()
			.selectResult();
	}

	public getMacroElement(): promise.Promise<ElementFinder> {
		return this.pageEditor.hasEditor().then((hasEditor) => {
			if (hasEditor) {
				return this.pageEditor.executeInEditorContext(() => {
					return asyncElement(this.macroLocator);
				});
			} else {
				return asyncElement(this.macroLocator);
			}
		});
	}
}
