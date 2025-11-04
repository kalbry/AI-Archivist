# AI Archivist Testing Guide

## Test Structure

The test suite is organized into three levels:

### 1. Unit Tests (`/tests/unit/`)
- Test individual components in isolation
- Mock external dependencies
- Fast execution
- High coverage

Key files:
- `base-scraper.test.js`: Tests for base scraping functionality
- `chatgpt-scraper.test.js`: ChatGPT-specific scraping tests
- `scraper-factory.test.js`: Platform factory tests

### 2. Integration Tests (`/tests/integration/`)
- Test multiple components working together
- Use real browser instances
- Mock external services
- Verify cross-component communication

Key files:
- `scraper.test.js`: Tests complete scraping flows

### 3. E2E Tests (`/tests/e2e/`)
- Test complete application flows
- Use real Electron app
- Simulate user interactions
- Verify UI state changes

Key files:
- `app.test.js`: Full application workflow tests

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Environment Setup

### Jest Configuration
- Uses jsdom environment
- Includes Playwright for browser tests
- Mocks Electron IPC communication
- Sets up testing-library utilities

### Mocks and Fixtures
- Platform configurations
- Browser instances
- Page content
- IPC messages

## Writing Tests

### Unit Test Example
```javascript
describe('ChatGPTScraper', () => {
    test('processes code blocks correctly', async () => {
        const scraper = new ChatGPTScraper();
        const result = await scraper.processCodeBlocks(mockContent);
        expect(result).toMatchExpectedFormat();
    });
});
```

### Integration Test Example
```javascript
describe('Scraper Integration', () => {
    test('completes full extraction flow', async () => {
        const scraper = new Scraper('chatgpt');
        await scraper.initialize();
        const results = await scraper.scrapeConversations();
        expect(results).toBeValidConversations();
    });
});
```

### E2E Test Example
```javascript
test('archives conversation successfully', async () => {
    const window = await electronApp.firstWindow();
    await window.click('[data-testid="start-archive"]');
    await expect(window).toHaveText(/Archive Complete/);
});
```

## Best Practices

1. **Isolation**
   - Mock external dependencies
   - Reset state between tests
   - Clean up resources

2. **Coverage**
   - Test error cases
   - Verify edge conditions
   - Include timeout scenarios

3. **Maintenance**
   - Keep tests focused
   - Use descriptive names
   - Document complex setups

4. **Performance**
   - Minimize browser usage
   - Batch similar tests
   - Use appropriate timeout values

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Release tags

### CI Pipeline
1. Install dependencies
2. Run unit tests
3. Run integration tests
4. Run E2E tests
5. Generate coverage report

## Debugging Tests

1. Use Jest debug mode:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

2. Enable verbose logging:
```bash
npm test -- --verbose
```

3. Check test coverage:
```bash
npm run test:coverage
```

## Common Issues

1. **Timeouts**
   - Increase timeout values
   - Check network conditions
   - Verify selectors

2. **Authentication**
   - Use mock credentials
   - Skip real auth in tests
   - Handle session expiry

3. **Browser Issues**
   - Clean up instances
   - Check resource usage
   - Verify browser version