import {pageObjectUtils} from "../utils/pageObjectUtils";

export class ConfluenceAction {
	private path: string;

	constructor(options: { path: string }) {
		pageObjectUtils.assertNotNull(options.path, 'ConfluenceAction "path" must not be null');

		this.path = options.path;

		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}

	public getPath() {
		return this.path;
	}

	public open(options?) { // TODO: better type for options
		return pageObjectUtils.openPage(this.path, options);
	}
}
