const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 9: Search Product', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should search for a product and verify results', async () => {
        await driver.get('http://automationexercise.com');

        await driver.wait(until.titleContains('Automation Exercise'), 10000);

        const productsButton = await driver.wait(until.elementLocated(By.css('a[href="/products"]')), 10000);
        await productsButton.click();

        await driver.wait(until.titleContains('All Products'), 10000);
        const allProductsHeader = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'All Products')]")), 10000);
        expect(await allProductsHeader.isDisplayed()).toBe(true);

        const searchInput = await driver.findElement(By.id('search_product'));
        await searchInput.sendKeys('Dress');
        const searchButton = await driver.findElement(By.id('submit_search'));
        await searchButton.click();

        const searchedProductsHeader = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'Searched Products')]")), 10000);
        expect(await searchedProductsHeader.isDisplayed()).toBe(true);

        const productList = await driver.findElements(By.className('productinfo text-center'));
        expect(productList.length).toBeGreaterThan(0);
        for (let product of productList) {
            expect(await product.isDisplayed()).toBe(true);
        }
    });
});