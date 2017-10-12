import {browser} from "protractor";
import {ConfluenceEditor} from "../page-objects/ConfluenceEditor";
import {ConfluenceMacroBrowser} from "../page-objects/ConfluenceMacroBrowser";
import {ConfluencePage} from "../page-objects/ConfluencePage";

describe("ConfluenceMacroBrowser (page object)", () => {
	const timestamp = new Date().valueOf();
	const uniquePageTitle = "Test Page - " + timestamp;

	const page = new ConfluencePage(uniquePageTitle, "ds");
	const pageEditor = new ConfluenceEditor();
	const macroBrowser = new ConfluenceMacroBrowser("Info", "info");

	beforeAll(() => {
		pageEditor.authenticateAsAdmin();
	});

	describe("insertMacroViaBracket()", () => {
		beforeAll(() => {
			page.create();
			pageEditor.waitUntilEditorClosed();
		});

		afterAll(() => {
			browser.getTitle().then((pageTitle) => {
				if (pageTitle.indexOf(uniquePageTitle) >= 0) {
					page.remove();
				}
			});
		});

		it("inserts Macro", () => {
			page.edit();
			pageEditor.waitUntilEditorOpened();

			macroBrowser.insertMacroViaBracket();

			macroBrowser.getMacroElement().then((macro) => {
				// browser.wait(macro.isPresent(), DEFAULT_LOADING_TIMEOUT);

				page.getEditor().executeInEditorContext(() => {
					expect(macro.isPresent()).toBe(true);
				});

				pageEditor.cancel();
				pageEditor.waitUntilEditorClosed();
			});

		});
	});

});
