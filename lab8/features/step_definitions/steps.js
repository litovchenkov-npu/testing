const { Given, When, Then, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');

setDefaultTimeout(30000);

let driver;

Given('I open the browser and navigate to {string}', async function (url) {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get(url);
});

When('I click on the element with selector {string}', async function (selector) {
    const element = await driver.findElement(By.css(selector));
    await driver.wait(until.elementIsVisible(element), 10000);
    await element.click();
});

When('I enter {string} into the input with selector {string}', async function (value, selector) {
    if (value.includes('{timestamp}')) {
    const timestamp = Date.now();
    value = value.replace('{timestamp}', timestamp);
    }
    await driver.findElement(By.css(selector)).sendKeys(value);
});

When('I select gender {string}', async function (gender) {
    const selector = gender.toLowerCase() === 'mr' ? '#id_gender1' : '#id_gender2';
    await driver.findElement(By.css(selector)).click();
});

When('I select {string} from dropdown with selector {string}', async function (value, selector) {
    const dropdown = await driver.findElement(By.css(selector));
    await dropdown.sendKeys(value);
});

When('I check the checkbox with selector {string}', async function (selector) {
    await driver.findElement(By.css(selector)).click();
});

Then('I should see the text {string}', async function (expectedText) {
    try {
        await driver.wait(until.alertIsPresent(), 3000);
        const alert = await driver.switchTo().alert();
        await alert.accept();
    } catch (err) {}

    await driver.wait(async () => {
        const body = await driver.findElement(By.tagName('body'));
        const text = await body.getText();
        return text.toLowerCase().includes(expectedText.toLowerCase());
    }, 10000, `Expected to find text "${expectedText}", but didn't.`);
});

After(async function () {
    if (driver) {
        await driver.quit();
    }
});