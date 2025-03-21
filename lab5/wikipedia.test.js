const { Builder, By, until, Key } = require('selenium-webdriver');

describe('Wikipedia Selenium Tests', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('should open Wikipedia homepage and find key elements', async () => {
        await driver.get('https://www.wikipedia.org');

        const searchBox = await driver.wait(until.elementLocated(By.id('searchInput')), 5000);
        expect(searchBox).toBeDefined();

        const logo = await driver.wait(until.elementLocated(By.css('div.central-textlogo')), 5000);
        expect(logo).toBeDefined();
    });

    test('should search for Selenium and verify the results page', async () => {
        await driver.get('https://www.wikipedia.org');

        const searchBox = await driver.wait(until.elementLocated(By.id('searchInput')), 5000);
        await searchBox.sendKeys('Selenium', Key.RETURN);

        await driver.wait(until.titleContains('Selenium'), 5000);
        const title = await driver.getTitle();
        expect(title).toContain('Selenium');
    });

    test('should open Selenium Wikipedia page and verify elements', async () => {
        await driver.get('https://en.wikipedia.org/wiki/Selenium');

        const titleElement = await driver.wait(until.elementLocated(By.xpath('//h1')), 5000);
        const titleText = await titleElement.getText();
        expect(titleText).toBe('Selenium');

        await driver.wait(until.elementsLocated(By.css('.vector-menu-content a')), 5000);
        const navLinks = await driver.findElements(By.css('.vector-menu-content a'));
        expect(navLinks.length).toBeGreaterThan(0);

        const firstLinkHref = await navLinks[0].getAttribute('href');
        expect(firstLinkHref).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\//);

        const searchBox = await driver.wait(until.elementLocated(By.id('searchInput')), 5000);
        expect(searchBox).toBeDefined();
    });

    test('should navigate to an internal link and verify', async () => {
        await driver.get('https://en.wikipedia.org/wiki/Selenium');

        const firstInternalLink = await driver.wait(until.elementLocated(By.css('#mw-content-text a:not([class])')), 5000);
        const expectedUrl = await firstInternalLink.getAttribute('href');
        await firstInternalLink.click();

        await driver.wait(until.urlContains(expectedUrl), 5000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(expectedUrl);
    });

    test('should check CSS properties of an element', async () => {
        await driver.get('https://en.wikipedia.org/wiki/Selenium');

        const titleElement = await driver.wait(until.elementLocated(By.xpath('//h1')), 5000);
        const titleColor = await titleElement.getCssValue('color');
        expect(titleColor).toBe('rgba(16, 20, 24, 1)');
    });
});