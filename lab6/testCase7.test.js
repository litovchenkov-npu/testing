const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 7: Verify Test Cases Page', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('should navigate to test cases page successfully', async () => {
        await driver.get('http://automationexercise.com');

        await driver.wait(until.titleContains('Automation Exercise'), 10000);

        const testCasesButton = await driver.wait(until.elementLocated(By.linkText('Test Cases')), 10000);
        await testCasesButton.click();

        await driver.wait(until.titleContains('Test Cases'), 10000);
        const testCasesHeader = await driver.wait(until.elementLocated(By.className('title')), 10000);
        expect(await testCasesHeader.isDisplayed()).toBe(true);
    });
});