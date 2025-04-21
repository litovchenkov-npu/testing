const pactum = require('pactum');
const { spec } = pactum;

pactum.request.setBaseUrl('https://api.dictionaryapi.dev/api/v2/entries');

const wordsToTest = ['hello', 'test', 'run', 'cat', 'house'];

describe('Dictionary API Tests', () => {
    it.each(wordsToTest)('should find at least one usage example for the word "%s"', async (word) => {
        jest.setTimeout(15000);

        await spec()
            .get(`/en/${word}`)
            .expectStatus(200)
            .expect((ctx) => {
                const entries = ctx.res.body;
                expect(entries).toBeDefined();
                expect(Array.isArray(entries)).toBe(true);
                expect(entries.length).toBeGreaterThan(0);

                const exampleFound = entries.some(entry =>
                    entry.meanings?.some(meaning =>
                        meaning.definitions?.some(definition =>
                            typeof definition.example === 'string' && definition.example.trim().length > 0
                        )
                    )
                );

                expect(exampleFound).toBe(true, `Expected to find at least one usage example for the word "${word}", but none were found.`);
            });
    });

    it('should return 404 for a non-existent word', async () => {
        jest.setTimeout(10000);
        const nonExistentWord = 'nonexistentword';
        await spec()
            .get(`/en/${nonExistentWord}`)
            .expectStatus(404)
            .expectJsonLike({
                title: "No Definitions Found"
            });
    });
});