import {browser, by, element, ExpectedConditions} from "protractor";
import {pageObjectUtils} from "../../utils/pageObjectUtils";

import {promise} from "selenium-webdriver";
import {ConfluenceSpace} from "../ConfluenceSpace";

const asyncElement = pageObjectUtils.asyncElement;
const waitForElementToBeClickable = pageObjectUtils.waitForElementToBeClickable;
const findFirstDisplayed = pageObjectUtils.findFirstDisplayed;
const DEFAULT_LOADING_TIMEOUT = pageObjectUtils.DEFAULT_LOADING_TIMEOUT;

export class SpaceWizard {
	private space: ConfluenceSpace;

	constructor(space: ConfluenceSpace) {
		this.space = space;
	}

	public open(): promise.Promise<void> {
		const EC = ExpectedConditions;
		this.space.spaceActions.spaceDirectory.open();

		const createSpaceButton = asyncElement(by.id("addSpaceLink"));
		createSpaceButton.click().then(() => {
			// passed, do nothing
		}, (err) => {
			console.log('error opening space wizard:', err);
			this.space.skipNotifications();
			createSpaceButton.click();
		});

		const skipButtonSelector = by.css(".start-creating-space");
		const skipButtonVisibility = EC.presenceOf(element(skipButtonSelector));
		const templateContainerVisibility = EC.presenceOf(
			element(by.css(".template-select-container-body .templates")));

		return browser.wait(EC.or(skipButtonVisibility, templateContainerVisibility), DEFAULT_LOADING_TIMEOUT)
			.then(() => {
				// TODO: EC#presenceOf simply returns Function as typing. Add scaffolding to make it into () => Promise?<boolean> to get rid of this explicit any
				skipButtonVisibility().then((skipButtonVisible: any) => {
					if (skipButtonVisible) {
						element(skipButtonSelector).click();
					}
				});
			});
	}

	public selectTemplate(itemModuleCompleteKey: string) {
		const templateSelector = '[data-item-module-complete-key="' + itemModuleCompleteKey + '"]';
		asyncElement(by.css(templateSelector)).click();
		asyncElement(by.css(ConfluenceSpace.createButtonSelector)).click();
	}

	public clickCreateButton() {
		const createButton = waitForElementToBeClickable(findFirstDisplayed(by.css(ConfluenceSpace.createButtonSelector)));
		createButton.click();
	}

	public fillSpaceForm() {
		const EC = ExpectedConditions;

		// set space name
		const spaceNameInput = asyncElement(by.name("name"));
		spaceNameInput.sendKeys(this.space.spaceName);
		spaceNameInput.sendKeys("\t");

		const spaceKeyInput = asyncElement(by.name("spaceKey"));

		// wait for create button before setting a space key
		spaceKeyInput.clear();
		const buttonNotClickable = EC.not(EC.elementToBeClickable(
			findFirstDisplayed(by.css(ConfluenceSpace.createButtonSelector))));
		browser.wait(buttonNotClickable, DEFAULT_LOADING_TIMEOUT);

		spaceKeyInput.sendKeys(this.space.spaceKey);
		spaceKeyInput.sendKeys("\t");
	}
}
