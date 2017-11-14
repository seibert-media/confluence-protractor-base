import {browser, by, element, ElementFinder} from "protractor";
import {promise} from "selenium-webdriver";
import {AutocompleteSearch} from "../utils/elements/AutocompleteSearch";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceEditor} from "./ConfluenceEditor";

const asyncElement = pageObjectUtils.asyncElement;

export class ConfluenceMacro {

	public macroName: string;
	public dataMacroName: string;

	public pageEditor: ConfluenceEditor = new ConfluenceEditor();
	public macroLocator: any; // Locator causes tsc error (TS2345)

	/**
	 *
	 * @param macroName Name of macro in UI
	 * @param dataMacroName Name of macro that is used in the macro's data attribute in DOM
	 * @constructor
	 */
	constructor(macroName: string, dataMacroName?: string) {
		this.macroName = macroName;
		this.dataMacroName = dataMacroName || macroName.toLowerCase();
		this.macroLocator = by.css('[data-macro-name="' + this.dataMacroName + '"]');

		pageObjectUtils.assertNotNull(this.macroName, 'First param "macroName" must be set');
	}

	// At this point we can only handle macros without settings or required settings with defaults
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

		this.saveDefaultMacroSettingsIfPresent();
	}

	public saveDefaultMacroSettingsIfPresent() {
		const macroSettingsSaveButton = element(by.css("#macro-details-page .button-panel-button"));
		pageObjectUtils.clickIfPresentAsync(macroSettingsSaveButton);
	}

	public executeInContext(fnToExecute: () => any): any {
		return this.pageEditor.hasEditor().then((hasEditor) => {
			if (hasEditor) {
				return this.pageEditor.executeInEditorContext(() => {
					return fnToExecute();
				});
			} else {
				return fnToExecute();
			}
		});
	}

	public getMacroElement(): promise.Promise<ElementFinder> {
		return this.executeInContext(() => {
			return asyncElement(this.macroLocator);
		});
	}

	public isMacroPresent() {
		return this.executeInContext(() => {
			return asyncElement(this.macroLocator).isPresent();
		});
	}
}
