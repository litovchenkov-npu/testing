const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 2: Login User with correct email and password', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        const timestamp = Date.now();
        name = `name${timestamp}`;
        email = `email${timestamp}@mail.com`;
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should register a new user', async () => {
        await driver.get('http://automationexercise.com');
        await expect(await driver.findElement(By.css('#slider')).isDisplayed()).toBe(true);

        await driver.findElement(By.css('a[href="/login"]')).click();
        await expect(await driver.findElement(By.css('.signup-form h2')).getText()).toBe('New User Signup!');

        await driver.findElement(By.css('input[data-qa="signup-name"]')).sendKeys(name);
        await driver.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(email);
        await driver.findElement(By.css('button[data-qa="signup-button"]')).click();
        await expect(await driver.findElement(By.css('.login-form h2 b')).getText()).toBe('ENTER ACCOUNT INFORMATION');

        await driver.findElement(By.id('id_gender1')).click();
        await driver.findElement(By.id('password')).sendKeys('password123');
        await driver.findElement(By.id('days')).sendKeys('1');
        await driver.findElement(By.id('months')).sendKeys('January');
        await driver.findElement(By.id('years')).sendKeys('2000');
        await driver.findElement(By.id('newsletter')).click();
        await driver.findElement(By.id('optin')).click();
        await driver.findElement(By.id('first_name')).sendKeys('John');
        await driver.findElement(By.id('last_name')).sendKeys('Doe');
        await driver.findElement(By.id('company')).sendKeys('Company');
        await driver.findElement(By.id('address1')).sendKeys('Address 1');
        await driver.findElement(By.id('address2')).sendKeys('Address 2');
        await driver.findElement(By.id('country')).sendKeys('Country');
        await driver.findElement(By.id('state')).sendKeys('State');
        await driver.findElement(By.id('city')).sendKeys('City');
        await driver.findElement(By.id('zipcode')).sendKeys('12345');
        await driver.findElement(By.id('mobile_number')).sendKeys('1234567890');
        await driver.findElement(By.css('button[data-qa="create-account"]')).click();
        await expect(await driver.findElement(By.css('h2[data-qa="account-created"] b')).getText()).toBe('ACCOUNT CREATED!');

        await driver.findElement(By.css('a[data-qa="continue-button"]')).click();
        await expect(await driver.findElement(By.css('li b')).getText()).toBe(name);
    }, 30000);

    it('should logout user', async () => {
        await driver.findElement(By.linkText('Logout')).click();
        await driver.wait(until.urlContains('login'), 5000);
        const loginPageElement = await driver.findElement(By.css('div.login-form'));
        expect(await loginPageElement.isDisplayed()).toBeTruthy();
    });

    it('should login user with correct email and password', async () => {
        await driver.findElement(By.css('a[href="/login"]')).click();
    
        const loginHeader = await driver.findElement(By.css('.login-form h2')).getText();
        expect(loginHeader).toBe('Login to your account');
    
        await driver.findElement(By.css('input[data-qa="login-email"]')).sendKeys(email);
        await driver.findElement(By.css('input[data-qa="login-password"]')).sendKeys('password123');
    
        await driver.findElement(By.css('button[data-qa="login-button"]')).click();
    
        const loggedInText = await driver.findElement(By.xpath("//a[contains(text(),'Logged in as')]")).getText();
        expect(loggedInText).toContain(name);
    }, 30000);
});