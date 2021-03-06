import {ElementFinder} from "protractor";
import {promise} from "selenium-webdriver";
import {ConfluenceEditor} from "../ConfluenceEditor";

export class ConfluenceEditorFakeInput {

	private editor: ConfluenceEditor;

	constructor(editor: ConfluenceEditor) {
		this.editor = editor;
	}

	public extendResult(result: promise.Promise<void>) {
		// TODO: Check this way more thoroughly
		result["clear"] = this.clear; // tslint:disable-line
		result["sendKeys"] = this.sendKeys; // tslint:disable-line
		return result;
	}

	public clear() {
		return this.editor.executeInEditorContext((editorInput: ElementFinder) => {
			return this.extendResult(editorInput.clear());
		});
	}

	public sendKeys(keys: string) {
		return this.editor.executeInEditorContext((editorInput: ElementFinder) => {
			return this.extendResult(editorInput.sendKeys(keys));
		});
	}
}
