const { Builder, By } = require('selenium-webdriver');

let driver;

describe('Test Case 3: Login User with incorrect email and password', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should login user with incorrect email and password', async () => {
        await driver.get('http://automationexercise.com');
        await expect(await driver.findElement(By.css('#slider')).isDisplayed()).toBe(true);

        await driver.findElement(By.css('a[href="/login"]')).click();
        const loginHeader = await driver.findElement(By.css('.login-form h2')).getText();
        expect(loginHeader).toBe('Login to your account');
    
        await driver.findElement(By.css('input[data-qa="login-email"]')).sendKeys('incorrectemailPuSHv9Tf@mail.com');
        await driver.findElement(By.css('input[data-qa="login-password"]')).sendKeys('password123');
    
        await driver.findElement(By.css('button[data-qa="login-button"]')).click();
    
        const errorText = await driver.findElement(By.xpath("//p[contains(text(),'Your email or password is incorrect!')]")).getText();
        expect(errorText).toBe('Your email or password is incorrect!');
    }, 30000);
});