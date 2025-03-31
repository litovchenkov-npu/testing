const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 10: Verify Subscription in home page', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should subscribe to newsletter and verify success message', async () => {
        await driver.get('http://automationexercise.com');

        await driver.wait(until.titleContains('Automation Exercise'), 10000);

        const footer = await driver.findElement(By.css('footer'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', footer);

        const subscriptionText = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'Subscription')]")), 10000);
        expect(await subscriptionText.isDisplayed()).toBe(true);

        const emailInput = await driver.findElement(By.id('susbscribe_email'));
        await emailInput.sendKeys('test@example.com');
        const subscribeButton = await driver.findElement(By.id('subscribe'));
        await subscribeButton.click();

        const successMessage = await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'You have been successfully subscribed!')]")), 10000);
        expect(await successMessage.isDisplayed()).toBe(true);
    });
});
