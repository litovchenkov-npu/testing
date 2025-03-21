const { UserService, asyncHello, computeValue, asyncError, ApiClient, ApiHelper, calculateFinalPrice, OrderProcessor } = require('./labAssignment');

// Тест класу UserService
describe('UserService', () => {
    it('should call getFullName with "John" and "Doe"', () => {
        const mockGetFullName = jest.fn().mockReturnValue('John Doe');
        const userService = new UserService(mockGetFullName);
        
        userService.greet();
        
        expect(mockGetFullName).toHaveBeenCalledWith('John', 'Doe');
    });

    it('should return greeting in uppercase format', () => {
        const mockGetFullName = jest.fn().mockReturnValue('John Doe');
        const userService = new UserService(mockGetFullName);
        
        const result = userService.greet();
        
        expect(result).toBe('HELLO, JOHN DOE!');
    });
});

// Тест функції asyncHello
describe('asyncHello', () => {
    it('should resolve to "hello world"', async () => {
        await expect(asyncHello()).resolves.toBe("hello world");
    });
});

// Тест функції computeValue
describe('computeValue', () => {
    it('should return 94', async () => {
        await expect(computeValue()).resolves.toBe(94);
    });
});

// Тест функції asyncError
describe('asyncError', () => {
    it('should reject with an error message "Something went wrong"', async () => {
        await expect(asyncError()).rejects.toThrow("Something went wrong");
    });
});

// Тест методу fetchData класу ApiClient
describe('ApiClient', () => {
    it('should fetch data and add fetchedAt timestamp', async () => {
        const mockResponse = { data: 'test' };
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(mockResponse)
        }));
        
        const apiClient = new ApiClient();
        const result = await apiClient.fetchData();
        
        expect(result).toMatchObject(mockResponse);
        expect(result).toHaveProperty('fetchedAt');
        expect(typeof result.fetchedAt).toBe('number');
    });
});

// Тест методу fetchViaHelper класу ApiHelper 
describe('ApiHelper', () => {
    it('should fetch data via helper and return expected result', async () => {
        const mockData = { key: 'value' };
        const mockApiCallFunction = jest.fn().mockResolvedValue(mockData);
        
        const apiHelper = new ApiHelper();
        const result = await apiHelper.fetchViaHelper(mockApiCallFunction);
        
        expect(result).toEqual(mockData);
    });
});

// Тест функції calculateFinalPrice
describe('calculateFinalPrice', () => {
    it('should calculate the correct final price', () => {
        const order = {
            items: [{ price: 100, quantity: 2 }],
            taxRate: 0.1,
            discountService: { getDiscount: jest.fn().mockReturnValue(0.2) },
        };
        
        const finalPrice = calculateFinalPrice(order, order.discountService);
        expect(finalPrice).toBe(176);
    });

    it('should throw an error for invalid order data', () => {
        expect(() => calculateFinalPrice(null, null)).toThrow("Invalid order");
        expect(() => calculateFinalPrice({}, null)).toThrow("Invalid order");
        expect(() => calculateFinalPrice({ items: [] }, null)).toThrow("Invalid order");
        expect(() => calculateFinalPrice({ items: [{ price: -10, quantity: 1 }] }, null)).toThrow("Invalid item data");
    });

    it('should apply maximum discount limit of 50%', () => {
        const order = {
            items: [{ price: 200, quantity: 1 }],
            taxRate: 0.1,
            discountService: { getDiscount: jest.fn().mockReturnValue(0.8) },
        };
        
        const finalPrice = calculateFinalPrice(order, order.discountService);
        expect(finalPrice).toBe(110);
    });
});

// Тест методу processOrder класу OrderProcessor
describe('OrderProcessor', () => {
    it('should process order and convert currency correctly', async () => {
        const mockCurrencyConverter = jest.fn().mockResolvedValue(200);
        const orderProcessor = new OrderProcessor(mockCurrencyConverter);
        const order = {
            items: [{ price: 100, quantity: 2 }],
            taxRate: 0.1,
            discountService: { getDiscount: jest.fn().mockReturnValue(0.2) },
            currency: 'USD',
        };
    
        const finalPrice = await orderProcessor.processOrder(order, 'EUR');
        expect(mockCurrencyConverter).toHaveBeenCalledWith(176, 'USD', 'EUR');
        expect(finalPrice).toBe(200);
    });

    it('should return original price if currency conversion fails', async () => {
        const mockCurrencyConverter = jest.fn().mockRejectedValue(new Error('Conversion failed'));
        const orderProcessor = new OrderProcessor(mockCurrencyConverter);
        const order = {
            items: [{ price: 100, quantity: 2 }],
            taxRate: 0.1,
            discountService: { getDiscount: jest.fn().mockReturnValue(0.2) },
            currency: 'USD',
        };
    
        const finalPrice = await orderProcessor.processOrder(order, 'EUR');
        expect(mockCurrencyConverter).toHaveBeenCalledWith(176, 'USD', 'EUR');
        expect(finalPrice).toBe(176);
    });
});