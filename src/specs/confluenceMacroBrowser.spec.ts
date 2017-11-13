import {ConfluenceEditor} from "../page-objects/ConfluenceEditor";
import {ConfluenceMacroBrowser} from "../page-objects/ConfluenceMacroBrowser";
import {ConfluencePage} from "../page-objects/ConfluencePage";

describe("ConfluenceMacroBrowser (page object)", () => {
	const timestamp = new Date().valueOf();
	const uniquePageTitle = "Test Page - " + timestamp + " - macro";
	const page = new ConfluencePage(uniquePageTitle, "ds");

	const pageEditor = new ConfluenceEditor();

	const macros = [
		new ConfluenceMacroBrowser("Info"),
		new ConfluenceMacroBrowser("Status"),
	];

	beforeAll(() => {
		pageEditor.login();
		page.create();
	});

	afterAll(() => {
		page.remove();
	});

	describe("insertMacroViaBracket()", () => {
		macros.forEach((macro) => {
			describe('"' + macro.macroName + '"', () => {
				it("opens editor", () => {
					page.edit();
					pageEditor.waitUntilEditorOpened();
				});

				it("inserts macro", () => {
					macro.insertMacroViaBracket();

					expect(macro.isMacroPresent()).toBe(true);
				});

				it("saves and closes the editor", () => {
					pageEditor.save();
					pageEditor.waitUntilEditorClosed();

					expect(macro.isMacroPresent()).toBe(true);
				});
			});
		});
	});
});
