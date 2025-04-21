const pactum = require('pactum');

describe('GOV.UK Bank Holidays API Tests', () => {
    const baseUrl = 'https://www.gov.uk/bank-holidays.json';

    it('should retrieve the bank holidays data', async () => {
        await pactum
            .spec()
            .get(baseUrl)
            .expectStatus(200)
            .expectJsonLike({});
    });

    it('should check the number of bank holidays for England and Wales in 2025', async () => {
        const expectedHolidays = 8;

        const response = await pactum
            .spec()
            .get(baseUrl)
            .expectStatus(200)
            .returns();

        const englandAndWalesHolidays = response.body['england-and-wales']?.events.filter(
            (event) => new Date(event.date).getFullYear() === 2025
        );

        expect(englandAndWalesHolidays?.length).toBe(expectedHolidays);
    });

    it('should check the date of Easter Monday for England and Wales in 2025', async () => {
        const expectedEasterMonday = '2025-04-21';

        const response = await pactum
            .spec()
            .get(baseUrl)
            .expectStatus(200)
            .returns();

        const easterMondayEvent = response.body['england-and-wales']?.events.find(
            (event) => event.title === 'Easter Monday' && event.date === expectedEasterMonday
        );

        expect(easterMondayEvent).toBeDefined();
    });
});