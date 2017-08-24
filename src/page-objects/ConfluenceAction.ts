import {promise} from "selenium-webdriver";
import {OpenPageOptions, pageObjectUtils} from "../utils/pageObjectUtils";

export class ConfluenceAction {

	private readonly _path: string;

	constructor(options: { path: string }) {
		pageObjectUtils.assertNotNull(options.path, 'ConfluenceAction "path" must not be null');

		this._path = options.path;

		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}

	get path(): string {
		return this._path;
	}

	public getPath() {
		return this._path;
	}

	public open(options?: OpenPageOptions): promise.Promise<any> {
		return pageObjectUtils.openPage(this._path, options);
	}

}
