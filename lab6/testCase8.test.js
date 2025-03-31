const { Builder, By, until } = require('selenium-webdriver');

let driver;

describe('Test Case 8: Verify All Products and product detail page', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should verify that product details are displayed correctly', async () => {
        await driver.get('http://automationexercise.com');

        await driver.wait(until.titleContains('Automation Exercise'), 10000);

        const productsButton = await driver.wait(until.elementLocated(By.css('a[href="/products"]')), 10000);
        await productsButton.click();

        await driver.wait(until.titleContains('All Products'), 10000);
        const allProductsHeader = await driver.wait(
        until.elementLocated(By.xpath("//h2[contains(text(),'All Products')]")), 10000);
        expect(await allProductsHeader.isDisplayed()).toBe(true);

        const productsList = await driver.wait(
        until.elementLocated(By.className('features_items')), 10000);
        expect(await productsList.isDisplayed()).toBe(true);

        const firstProduct = await driver.wait(until.elementLocated(By.xpath("(//a[contains(text(),'View Product')])[1]")), 10000);
        await firstProduct.click();

        await driver.wait(until.urlContains('product_details'), 10000);

        const productName = await driver.wait(until.elementLocated(By.xpath('/html/body/section/div/div/div[2]/div[2]/div[2]/div/h2')), 10000);
        expect(await productName.isDisplayed()).toBe(true);

        const productCategory = await driver.findElement(By.xpath("//p[contains(text(),'Category')]"));
        expect(await productCategory.isDisplayed()).toBe(true);

        const productPrice = await driver.findElement(By.xpath("//span[contains(text(),'Rs.')]"));
        expect(await productPrice.isDisplayed()).toBe(true);

        const productAvailability = await driver.findElement(By.xpath("//b[contains(text(),'Availability:')]"));
        expect(await productAvailability.isDisplayed()).toBe(true);

        const productCondition = await driver.findElement(By.xpath("//b[contains(text(),'Condition:')]"));
        expect(await productCondition.isDisplayed()).toBe(true);

        const productBrand = await driver.findElement(By.xpath("//b[contains(text(),'Brand:')]"));
        expect(await productBrand.isDisplayed()).toBe(true);
    });
});