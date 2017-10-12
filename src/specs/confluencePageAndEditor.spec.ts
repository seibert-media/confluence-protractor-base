import {browser, by} from "protractor";
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
		pageEditor.authenticateAsAdmin();
	});

	describe("create()", () => {
		beforeAll(() => {
			page.create();
		});

		afterAll(() => {
			page.remove();
		});

		it("closes editor after save", () => {
			pageEditor.waitUntilEditorClosed();

			expect(pageEditor.hasEditor()).toBe(false);
		});

		it("can create a page", () => {
			expect(browser.getTitle()).toContain(uniquePageTitle);
		});
	});

	describe('edit()', function () {
		beforeAll(function () {
			page.create();
			pageEditor.waitUntilEditorClosed();
		});

		afterAll(function () {
			page.remove();
		});

		it('opens and closes the editor', function () {
			page.edit();
			expect(pageEditor.hasEditor()).toBe(true);
			page.getEditor().cancel();
			pageEditor.waitUntilEditorClosed();
			expect(pageEditor.hasEditor()).toBe(false);
		});

		describe('discardDraftIfPresent()', function () {
			beforeAll(function () {
				page.edit();
				pageEditor.editor.sendKeys("Some Content");
				pageEditor.cancel();
				pageEditor.waitUntilEditorClosed();
				pageObjectUtils.asyncElement(by.id('editPageLink')).click();
			});

			afterAll(function () {
				pageEditor.cancel();
				pageEditor.waitUntilEditorClosed();
			});

			it('has a draft message', function () {
				pageEditor.waitUntilEditorOpened();
				expect(element(by.id('draft-messages')).isPresent()).toBe(true);

				pageEditor.discardDraftIfPresent();
				expect(element(by.id('draft-messages')).isPresent()).toBe(false);
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
});
