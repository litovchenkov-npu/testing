const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 15: Place Order: Register before Checkout', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        const timestamp = Date.now();
        name = `name${timestamp}`;
        email = `email${timestamp}@mail.com`;
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should register a user, add products to cart, proceed to checkout, enter payment details, and delete the account', async () => {
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
        await driver.findElement(By.css('a[href="/products"]')).click();

        await driver.wait(until.elementLocated(By.css('.features_items')), 10000);
        const firstProduct = await driver.wait(
            until.elementLocated(By.xpath("(//div[contains(@class,'product-image-wrapper')])[1]")),
            10000
        );
        await driver.executeScript("arguments[0].scrollIntoView();", firstProduct);

        const addToCartButton1 = await driver.wait(
            until.elementLocated(By.xpath("(//div[contains(@class,'product-image-wrapper')])[1]//a[contains(text(),'Add to cart')]")),
            10000
        );
        await addToCartButton1.click();

        await driver.wait(until.elementLocated(By.id('cartModal')), 10000);
        const continueShoppingButton = await driver.wait(
            until.elementIsVisible(driver.findElement(By.xpath("//button[contains(text(),'Continue Shopping')]"))),
            10000
        );
        await driver.executeScript("arguments[0].click();", continueShoppingButton);

        const cartButton = await driver.wait(until.elementLocated(By.linkText('Cart')), 10000);
        await cartButton.click();
        await expect(await driver.findElement(By.css('#cart_items')).isDisplayed()).toBe(true);

        const proceedToCheckoutButton = await driver.findElement(By.css('.btn.btn-default.check_out'));
        await proceedToCheckoutButton.click();

        await expect(await driver.findElement(By.xpath("//h2[contains(text(),'Address Details')]")).isDisplayed()).toBe(true);
        await expect(await driver.findElement(By.xpath("//h2[contains(text(),'Review Your Order')]")).isDisplayed()).toBe(true);

        const commentTextArea = await driver.findElement(By.name('message'));
        await commentTextArea.sendKeys('Test comment');
        await driver.findElement(By.css('a[href="/payment"]')).click();
        await driver.findElement(By.css('input[data-qa="name-on-card"]')).sendKeys('Test Name');
        await driver.findElement(By.css('input[data-qa="card-number"]')).sendKeys('1234567890123456');
        await driver.findElement(By.css('input[data-qa="cvc"]')).sendKeys('123');
        await driver.findElement(By.css('input[data-qa="expiry-month"]')).sendKeys('01');
        await driver.findElement(By.css('input[data-qa="expiry-year"]')).sendKeys('2025');
        await driver.findElement(By.id('submit')).click();

        await expect(await driver.findElement(By.xpath('/html/body/section/div/div/div/p')).isDisplayed()).toBe(true);
        await driver.findElement(By.css('a[href="/delete_account"]')).click();
        
        await expect(await driver.findElement(By.css('h2[data-qa="account-deleted"] b')).getText()).toBe('ACCOUNT DELETED!');
        await driver.findElement(By.css('a[data-qa="continue-button"]')).click();
    }, 300000);
});