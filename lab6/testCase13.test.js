const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 13: Verify Product quantity in Cart', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should add a product to the cart with the correct quantity and verify it on the cart page', async () => {
        await driver.get('http://automationexercise.com');

        await driver.wait(until.titleContains('Automation Exercise'), 10000);

        const firstProduct = await driver.wait(
            until.elementLocated(By.xpath("(//div[contains(@class,'product-image-wrapper')])[1]//a[contains(text(),'View Product')]")),
            10000
        );
        await firstProduct.click();

        await driver.wait(until.elementLocated(By.css('.product-information')), 10000);

        const quantityInput = await driver.wait(
            until.elementLocated(By.css('input[id="quantity"]')),
            10000
        );
        await quantityInput.clear();
        await quantityInput.sendKeys('4');

        const addToCartButton = await driver.wait(
            until.elementLocated(By.css('button[class="btn btn-default cart"]')),
            10000
        );
        await addToCartButton.click();

        await driver.wait(until.elementLocated(By.className('modal-content')), 10000);

        const viewCartButton = await driver.wait(
            until.elementIsVisible(driver.findElement(By.xpath('/html/body/section/div/div/div[2]/div[1]/div/div/div[2]/p[2]/a'))),
            10000
        );
        await viewCartButton.click();

        const cartItems = await driver.wait(
            until.elementsLocated(By.xpath("//table[@id='cart_info_table']//tbody/tr")),
            10000
        );
        expect(cartItems.length).toBeGreaterThan(0);

        const row = cartItems[0];
        const quantity = await row.findElement(By.xpath(`./td[4]/button`)).getText();
        expect(quantity).toBe('4');
    });
});