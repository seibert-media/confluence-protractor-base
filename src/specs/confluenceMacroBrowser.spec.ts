import {browser} from "protractor";
import {ConfluenceEditor} from "../page-objects/ConfluenceEditor";
import {ConfluenceMacroBrowser} from "../page-objects/ConfluenceMacroBrowser";
import {ConfluencePage} from "../page-objects/ConfluencePage";

describe("ConfluenceMacroBrowser (page object)", () => {
	const timestamp = new Date().valueOf();
	const uniquePageTitle = "Test Page - " + timestamp + " - macro";

	const page = new ConfluencePage(uniquePageTitle, "ds");
	const pageEditor = new ConfluenceEditor();
	const macroBrowser = new ConfluenceMacroBrowser("Info", "info");

	beforeAll(() => {
		pageEditor.authenticateAsAdmin();
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

	describe("with bracket save", () => {
		it("opens editor", () => {
			page.edit();
			pageEditor.waitUntilEditorOpened();
		});

		it("inserts macro", () => {
			macroBrowser.insertMacroViaBracket();

			macroBrowser.getMacroElement().then((macro) => {
				page.getEditor().executeInEditorContext(() => {
					expect(macro.isPresent()).toBe(true);
				});
			});
		});

		it("saves and closes the editor", () => {
			pageEditor.save();
			pageEditor.waitUntilEditorClosed();

			macroBrowser.getMacroElement().then((macro) => {
				expect(macro.isPresent()).toBe(true);
			});
		});
	});
});
