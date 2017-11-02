import {browser, by, element} from "protractor";
import {ConfluenceEditor} from "../page-objects/ConfluenceEditor";
import {ConfluencePage} from "../page-objects/ConfluencePage";
import {pageObjectUtils} from "../utils/pageObjectUtils";

const openPage = pageObjectUtils.openPage;

describe("ConfluencePage und ConfluenceEditor (page object)", () => {

	const timestamp = new Date().valueOf();
	const uniquePageTitle = "Test Page - " + timestamp;
	const uniqueCommentContent = "Test Comment - " + timestamp;

	const page = new ConfluencePage(uniquePageTitle + " - page", "ds");
	const pageEditor = new ConfluenceEditor();

	beforeAll(() => {
		pageEditor.loginAsAdmin();
	});

	afterAll(() => {
		page.remove();
	});

	describe("create()", () => {
		it("closes editor after save", () => {
			page.create();

			pageEditor.waitUntilEditorClosed();

			expect(pageEditor.hasEditor()).toBe(false);
		});

		it("can create a page", () => {
			expect(browser.getTitle()).toContain(uniquePageTitle);
		});
	});

	describe("edit()", () => {
		it("opens the editor", () => {
			page.edit();

			expect(pageEditor.hasEditor()).toBe(true);
		});

		it("closes the editor", () => {
			page.getEditor().cancel();
			pageEditor.waitUntilEditorClosed();

			expect(pageEditor.hasEditor()).toBe(false);
		});

		describe("discardDraftIfPresent()", () => {
			beforeAll(() => {
				page.edit();
				pageEditor.editor.sendKeys("Some Content");
				pageEditor.cancel();
				pageEditor.keepDraftIfPresent();
				pageEditor.waitUntilEditorClosed();
				pageObjectUtils.asyncElement(by.id("editPageLink")).click();
			});

			afterAll(() => {
				pageEditor.cancel();
				pageEditor.waitUntilEditorClosed();
			});

			it("has and discards draft message", () => {
				pageEditor.waitUntilEditorOpened();
				expectDraftDialog(true);
				pageEditor.discardDraftIfPresent();
			});
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

	function expectDraftDialog(hasDialog: boolean) {
		let draftDialog = element(by.id("draft-messages"));

		if (pageEditor.confluenceVersion().greaterThanEquals("6.0")) {
			draftDialog = element(by.id("qed-discard-button"));
		}

		expect(draftDialog.isPresent()).toBe(hasDialog);
	}
});
