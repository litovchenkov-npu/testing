const pactum = require('pactum');
const { spec } = pactum;

pactum.request.setBaseUrl('https://catfact.ninja');

describe('Cat Fact API Tests', () => {

    describe('/breeds Endpoint', () => {
        const breedDataSchema = {
            type: 'object',
            properties: {
                breed: { type: 'string' },
                country: { type: 'string' },
                origin: { type: 'string' },
                coat: { type: 'string' },
                pattern: { type: 'string' }
            },
            required: ['breed', 'country', 'origin', 'coat', 'pattern']
        };
        const breedsResponseSchema = {
            type: 'object',
            properties: {
                current_page: { type: 'number' },
                data: { type: 'array', items: breedDataSchema },
                first_page_url: { type: 'string' },
                from: { type: ['number', 'null'] },
                last_page: { type: 'number' },
                last_page_url: { type: 'string' },
                links: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            url: { type: ['string', 'null'] },
                            label: { type: 'string' },
                            active: { type: 'boolean' }
                        },
                        required: ['label', 'active']
                    }
                },
                next_page_url: { type: ['string', 'null'] },
                path: { type: 'string' },
                per_page: { type: ['number', 'string'] },
                prev_page_url: { type: ['string', 'null'] },
                to: { type: ['number', 'null'] },
                total: { type: 'number' }
            },
            required: [
                'current_page', 'data', 'first_page_url', 'last_page',
                'last_page_url', 'links', 'path', 'per_page', 'total'
            ]
        };

        it('should return correct structure for /breeds', async () => {
            await spec()
                .get('/breeds')
                .expectStatus(200)
                .expectJsonSchema(breedsResponseSchema);
        });

        it('should respect limit parameter for /breeds', async () => {
            const limit = 5;
            await spec()
                .get('/breeds')
                .withQueryParams('limit', limit)
                .expectStatus(200)
                .expectJsonSchema(breedsResponseSchema)
                .expectJsonLength('data', limit)
                .expectJsonLike('per_page', limit);
        });

         it('should contain required headers for /breeds', async () => {
            await spec()
                .get('/breeds')
                .expectStatus(200)
                .expectHeader('server', /cloudflare/i)
                .expectHeaderContains('cache-control', 'no-cache')
                .expectHeader('date', /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
        });
    });

    describe('/fact Endpoint', () => {
        const factSchema = {
            type: 'object',
            properties: {
                fact: { type: 'string' },
                length: { type: 'number' }
            },
            required: ['fact', 'length']
        };

        it('should return correct structure for /fact', async () => {
            await spec()
                .get('/fact')
                .expectStatus(200)
                .expectJsonSchema(factSchema);
        });

        it('should respect max_length parameter for /fact', async () => {
            const maxLength = 30;
            await spec()
                .get('/fact')
                .withQueryParams('max_length', maxLength)
                .expectStatus(200)
                .expectJsonSchema(factSchema)
                .expect((ctx) => {
                    const body = ctx.res.body;
                    expect(body).toBeDefined();
                    expect(body).toHaveProperty('length');
                    const len = body.length;
                    expect(typeof len).toBe('number');
                    expect(len).toBeLessThanOrEqual(maxLength);
                });
        });

        it('should contain required headers for /fact', async () => {
            await spec()
                .get('/fact')
                .expectStatus(200)
                .expectHeader('server', /cloudflare/i)
                .expectHeaderContains('cache-control', 'no-cache')
                .expectHeader('date', /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
        });
    });

    describe('/facts Endpoint', () => {
         const factDataSchema = {
             type: 'object',
             properties: {
                 fact: { type: 'string' },
                 length: { type: 'number' }
             },
             required: ['fact', 'length']
         };
         const factsResponseSchema = {
             type: 'object',
             properties: {
                 current_page: { type: 'number' },
                 data: { type: 'array', items: factDataSchema },
                 first_page_url: { type: 'string' },
                 from: { type: ['number', 'null'] },
                 last_page: { type: 'number' },
                 last_page_url: { type: 'string' },
                 links: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            url: { type: ['string', 'null'] },
                            label: { type: 'string' },
                            active: { type: 'boolean' }
                        },
                        required: ['label', 'active']
                    }
                 },
                 next_page_url: { type: ['string', 'null'] },
                 path: { type: 'string' },
                 per_page: { type: ['number', 'string'] },
                 prev_page_url: { type: ['string', 'null'] },
                 to: { type: ['number', 'null'] },
                 total: { type: 'number' }
             },
             required: [
                'current_page', 'data', 'first_page_url', 'from', 'last_page',
                'last_page_url', 'links', 'next_page_url', 'path', 'per_page',
                'prev_page_url', 'to', 'total'
            ]
         };


        it('should return correct structure for /facts', async () => {
            await spec()
                .get('/facts')
                .expectStatus(200)
                .expectJsonSchema(factsResponseSchema);
        });

        it('should respect limit parameter for /facts', async () => {
            const limit = 3;
            await spec()
                .get('/facts')
                .withQueryParams('limit', limit)
                .expectStatus(200)
                .expectJsonSchema(factsResponseSchema)
                .expectJsonLength('data', limit)
                .expectJsonLike('per_page', limit);
        });

        it('should respect max_length parameter for /facts', async () => {
            const maxLength = 100;
            const limit = 5;
            await spec()
                .get('/facts')
                .withQueryParams({
                    limit: limit,
                    max_length: maxLength
                 })
                .expectStatus(200)
                .expectJsonSchema(factsResponseSchema)
                .expectJsonLength('data', limit)
                .expect((ctx) => {
                    const body = ctx.res.body;
                    expect(body).toBeDefined();
                    expect(body).toHaveProperty('data');
                    const facts = body.data;
                    expect(Array.isArray(facts)).toBe(true);
                    facts.forEach(factObj => {
                        expect(factObj).toHaveProperty('length');
                        expect(typeof factObj.length).toBe('number');
                        expect(factObj.length).toBeLessThanOrEqual(maxLength);
                    });
                });
        });

        it('should contain required headers for /facts', async () => {
            await spec()
                .get('/facts')
                .expectStatus(200)
                .expectHeader('server', /cloudflare/i)
                .expectHeaderContains('cache-control', 'no-cache')
                .expectHeader('date', /^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
        });
    });
});