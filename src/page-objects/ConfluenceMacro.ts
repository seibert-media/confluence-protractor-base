import {by, element} from "protractor";
import {AutocompleteSearch} from "../utils/elements/AutocompleteSearch";
import {pageObjectUtils} from "../utils/pageObjectUtils";
import {ConfluenceEditor} from "./ConfluenceEditor";

const asyncElement = pageObjectUtils.asyncElement;

export class ConfluenceMacro {

	public macroName: string;
	public dataMacroName: string;
	public macroViewLocator: any; // Locator causes tsc error (TS2345)
	public macroEditorLocator: any; // Locator causes tsc error (TS2345)

	public pageEditor: ConfluenceEditor = new ConfluenceEditor();

	/**
	 * @param options
	 * @param options.macroName Name of macro in UI
	 * @param options.dataMacroName Name of macro that is used in the macro's data attribute in Editor DOM
	 * @param options.macroViewLocator Used to locate the macro in View DOM
	 * @constructor
	 */
	constructor(options: {
		macroName: string,
		dataMacroName?: string,
		macroViewLocator?: any,
	}) {
		pageObjectUtils.assertNotNull(options, 'Options with param "macroName" must be set');
		this.macroName = options.macroName;
		this.dataMacroName = options.dataMacroName || this.macroName.toLowerCase();
		this.macroViewLocator = options.macroViewLocator || by.css("." + this.dataMacroName);
		this.macroEditorLocator = by.css("[data-macro-name='" + this.dataMacroName + "']");
	}

	// At this point we can only handle macros without settings or required settings with defaults
	public insertMacroViaBracket() {
		const resultElement = element(by.css(".autocomplete-macros span[title='" + this.macroName + "']"));
		const macroAutocomplete = new AutocompleteSearch({
			searchTerm: this.macroName,
			inputElement: this.pageEditor.editor,
			resultContainer: resultElement,
		});

		macroAutocomplete
			.search({searchPrefix: "{", skipClear: true})
			.waitForMatchingResult();
		resultElement.click();

		this.saveDefaultMacroSettingsIfPresent();
	}

	public saveDefaultMacroSettingsIfPresent() {
		const macroSettingsSaveButton = element(by.css("#macro-details-page .button-panel-button"));
		pageObjectUtils.clickIfPresentAsync(macroSettingsSaveButton);
	}

	public isMacroPresent(): any {
		return this.pageEditor.hasEditor().then((hasEditor) => {
			if (hasEditor) {
				return this.pageEditor.executeInEditorContext(() => {
					return asyncElement(this.macroEditorLocator).isPresent();
				});
			} else {
				return asyncElement(this.macroViewLocator).isPresent();
			}
		});
	}
}
