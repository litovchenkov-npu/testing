const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');

let driver;

describe('Test Case 6: Contact Us Form', () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('should submit contact us form successfully', async () => {
        await driver.get('http://automationexercise.com');

        await driver.wait(until.titleContains('Automation Exercise'), 10000);

        const contactUsButton = await driver.wait(
            until.elementLocated(By.linkText('Contact us')),
            10000
        );
        await driver.wait(until.elementIsVisible(contactUsButton), 10000);
        await contactUsButton.click();

        const getInTouchHeader = await driver.wait(
            until.elementLocated(By.xpath("//h2[contains(text(), 'Get In Touch')]")),
            10000
        );
        expect(await getInTouchHeader.isDisplayed()).toBe(true);

        await driver.findElement(By.name('name')).sendKeys('John Doe');
        await driver.findElement(By.name('email')).sendKeys('johndoe@example.com');
        await driver.findElement(By.name('subject')).sendKeys('Test Subject');
        await driver.findElement(By.name('message')).sendKeys('This is a test message.');

        const fileInput = await driver.findElement(By.name('upload_file'));
        const filePath = path.resolve(__dirname, 'dummy.txt');
        await fileInput.sendKeys(filePath);

        const submitButton = await driver.findElement(By.name('submit'));
        await submitButton.click();

        await driver.wait(until.alertIsPresent(), 5000);
        const alert = await driver.switchTo().alert();
        await alert.accept();

        const successMessage = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(text(), 'Success! Your details have been submitted successfully.')]")),
        10000
        );
        expect(await successMessage.isDisplayed()).toBe(true);

        const homeButton = await driver.findElement(By.xpath("//a[contains(text(), 'Home')]"));
        await homeButton.click();
        await driver.wait(until.titleContains('Automation Exercise'), 10000);
    });
});
