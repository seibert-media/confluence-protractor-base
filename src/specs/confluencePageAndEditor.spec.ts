import {browser} from "protractor";
import {ConfluenceEditor} from "../page-objects/ConfluenceEditor";
import {ConfluencePage} from "../page-objects/ConfluencePage";
import {pageObjectUtils} from "../utils/pageObjectUtils";

const openPage = pageObjectUtils.openPage;

describe("ConfluencePage und ConfluenceEditor (page object)", () => {

	const timestamp = new Date().valueOf();
	const uniquePageTitle = "Test Page - " + timestamp;
	const uniqueCommentContent = "Test Comment - " + timestamp;

	const page = new ConfluencePage(uniquePageTitle, "ds");
	const pageEditor = new ConfluenceEditor();

	beforeAll(() => {
		pageEditor.loginAsAdmin();
	});

	describe("create()", () => {
		beforeAll(() => {
			page.create();
		});

		afterAll(() => {
			browser.getTitle().then((pageTitle) => {
				if (pageTitle.indexOf(uniquePageTitle) >= 0) {
					page.remove();
				}
			});
		});

		it("closes editor after save", () => {
			pageEditor.waitUntilEditorClosed();

			expect(pageEditor.hasEditor()).toBe(false);
		});

		it("can create a page", () => {
			expect(browser.getTitle()).toContain(uniquePageTitle);
		});

		it( "can open editor", () => {
			page.openEditor();
			expect(pageEditor.hasEditor()).toBe(true);
			pageEditor.cancel();
		});
	});

	describe("comments", () => {
		it("are not present before tests", () => {
			expect(pageEditor.hasEditor()).toBe(false);
		});

		it("adds a comment", () => {
			openPage("display/ds");

			pageEditor.openComment();
			pageEditor.editor.sendKeys(uniqueCommentContent);
			pageEditor.save();

			pageEditor.waitUntilEditorClosed();

			expect(page.getLatestCommentContent()).toBe(uniqueCommentContent);
			expect(page.hasComments()).toBe(true);
		});

		it("removes the comment", () => {
			openPage("display/ds");

			page.removeLatestComment();

			expect(page.hasComments()).toBe(false);
		});

		it("cancels a comment", () => {
			openPage("display/ds");

			pageEditor.openComment();

			expect(pageEditor.hasEditor()).toBe(true);

			pageEditor.editor.sendKeys("Some content");

			pageEditor.cancelAndClear();

			expect(pageEditor.hasEditor()).toBe(false);
		});
	});
});
