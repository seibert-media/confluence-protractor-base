import {ConfluenceEditor} from "../ConfluenceEditor";

export class ConfluenceEditorFakeInput {

	private editor: ConfluenceEditor;

	constructor(editor: ConfluenceEditor) {
		this.editor = editor;
	}

	public extendResult(result) {
		result.clear = this.clear;
		result.sendKeys = this.sendKeys;
		return result;
	}

	public clear() {
		return this.editor.executeInEditorContext((editorInput) => {
			return this.extendResult(editorInput.clear());
		});
	}

	public sendKeys(keys) {
		return this.editor.executeInEditorContext((editorInput) => {
			return this.extendResult(editorInput.sendKeys(keys));
		});
	}
}
