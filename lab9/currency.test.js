const pactum = require('pactum');
const { spec } = pactum;

pactum.request.setBaseUrl('https://latest.currency-api.pages.dev/v1');

describe('Exchange Rate API Tests', () => {
    it('should list available currencies', async () => {
        await spec()
        .get('/currencies.json')
        .expectStatus(200)
        .expectHeaderContains('content-type', 'application/json')
        .expectJsonSchema({
            type: 'object',
            properties: {
                eur: { type: 'string' },
                usd: { type: 'string' },
                gbp: { type: 'string' },
                uah: { type: 'string' }
            },
            required: ['eur', 'usd', 'gbp', 'uah']
        });
    });

    it('should get exchange rates for EUR', async () => {
        const responseBody = await spec()
        .get('/currencies/eur.json')
        .expectStatus(200)
        .expectHeaderContains('content-type', 'application/json')
        .expectJsonSchema({
            type: 'object',
            required: ['date', 'eur'],
            properties: {
                date: { type: 'string' },
                eur: {
                    type: 'object',
                    properties: {
                        usd: { type: 'number' },
                        gbp: { type: 'number' },
                        uah: { type: 'number' }
                    },
                    required: ['usd', 'gbp', 'uah']
                }
            }
        })
        .returns('');

        expect(responseBody.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(typeof responseBody.eur.usd).toBe('number');
        expect(responseBody.eur.usd).toBeGreaterThan(0);
    });

    it('should get the specific EUR to USD rate', async () => {
        const rate = await spec()
        .get('/currencies/eur.json')
        .expectStatus(200)
        .expectHeaderContains('content-type', 'application/json')
        .returns('eur.usd');

        expect(typeof rate).toBe('number');
        expect(rate).toBeGreaterThan(0);
    });

    it('should return an error for a non-existent currency', async () => {
        await spec()
        .get('/currencies/xyz.json')
        .expectStatus(404);
    });
});