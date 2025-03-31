const { Builder, By } = require('selenium-webdriver');

let driver;

describe('Main page test', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('should have navbar, logo and signup/login button', async () => {
        await driver.get('https://automationexercise.com/');

        const navBar = await driver.findElement(By.css('.navbar-nav'));
        expect(await navBar.isDisplayed()).toBe(true);

        const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
        expect(await logo.isDisplayed()).toBe(true);

        const signupLoginButton = await driver.findElement(By.css('a[href="/login"]'));
        expect(await signupLoginButton.isDisplayed()).toBe(true);
    });

    test('should have alt text and signup/login button text', async () => {
        await driver.get('https://automationexercise.com/');

        const logo = await driver.findElement(By.css('img[src="/static/images/home/logo.png"]'));
        const altText = await logo.getAttribute('alt');
        expect(altText).toBe('Website for automation practice');

        const signupLoginButton = await driver.findElement(By.css('a[href="/login"]'));
        const buttonText = await signupLoginButton.getText();
        expect(buttonText).toBe('Signup / Login');
    });
});
