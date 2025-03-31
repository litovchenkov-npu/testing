const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 12: Add Products in Cart', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should add multiple products to cart and verify cart details', async () => {
        await driver.get('http://automationexercise.com');

        await driver.wait(until.titleContains('Automation Exercise'), 10000);

        const productsButton = await driver.wait(
        until.elementLocated(By.css('a[href="/products"]')),
        10000
        );
        await productsButton.click();

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

        const secondProduct = await driver.wait(
            until.elementLocated(By.xpath("(//div[contains(@class,'product-image-wrapper')])[2]")),
            10000
        );
        await driver.executeScript("arguments[0].scrollIntoView();", secondProduct);

        const addToCartButton2 = await driver.wait(
            until.elementLocated(By.xpath("(//div[contains(@class,'product-image-wrapper')])[2]//a[contains(text(),'Add to cart')]")),
            10000
        );
        await addToCartButton2.click();

        await driver.wait(until.elementLocated(By.id('cartModal')), 10000);

        const viewCartButton = await driver.wait(
            until.elementIsVisible(driver.findElement(By.css('a[href="/view_cart"]'))),
            10000
        );
        await viewCartButton.click();

        const cartItems = await driver.wait(
            until.elementsLocated(By.xpath("//table[@id='cart_info_table']//tbody/tr")),
            10000
        );
        expect(cartItems.length).toBeGreaterThanOrEqual(2);

        for (let i = 1; i <= cartItems.length; i++) {
            const row = cartItems[i - 1];
            const productName = await row.findElement(By.xpath(`./td[2]/p`)).getText();
            const productPrice = await row.findElement(By.xpath(`./td[3]/p`)).getText();
            const quantity = await row.findElement(By.xpath(`./td[4]/button`)).getText();
            const totalPrice = await row.findElement(By.xpath(`./td[5]/p`)).getText();

            expect(productName).toBeTruthy();
            expect(productPrice).toBeTruthy();
            expect(quantity).toBeTruthy();
            expect(totalPrice).toBeTruthy();
        }
    });
});