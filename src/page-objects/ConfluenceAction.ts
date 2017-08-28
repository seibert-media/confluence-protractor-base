import {promise} from "selenium-webdriver";
import {OpenPageOptions, pageObjectUtils} from "../utils/pageObjectUtils";

export class ConfluenceAction {

	public readonly path: string;

	constructor(options: { path: string }) {
		pageObjectUtils.assertNotNull(options.path, 'ConfluenceAction "path" must not be null');

		this.path = options.path;

		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}

	/**
	 * Legacy getter for path.
	 *
	 * @deprecated
	 * @returns {string}
	 */
	public getPath(): string {
		return this.path;
	}

	public open(options?: OpenPageOptions): promise.Promise<any> {
		return pageObjectUtils.openPage(this.path, options);
	}

}
