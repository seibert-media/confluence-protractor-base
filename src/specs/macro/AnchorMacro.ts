import {by, element} from "protractor";
import {ConfluenceMacro} from "../../page-objects/ConfluenceMacro";

const MACRO_PARAMS = {
	macroName: "Anchor",
	macroViewLocator: by.css(".confluence-anchor-link"),
};

/**
 * @extends {ConfluenceMacro}
 * @constructor
 */
export class AnchorMacro extends ConfluenceMacro {

	private params: {anchorName: string};

	constructor(params: {anchorName: string}) {
		super(MACRO_PARAMS);
		this.params = params;
	}

	public insertMacroParams() {
		this.insertAnchorName();
	}

	private insertAnchorName() {
		const anchorInput = element(by.id("macro-param-"));
		anchorInput.sendKeys(this.params.anchorName);
	}
}
