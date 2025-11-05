module.exports = {
    projects: [
        {
            displayName: 'unit',
            testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
            testEnvironment: 'jsdom',
            setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js']
        },
        {
            displayName: 'integration',
            testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
            testEnvironment: 'node',
            setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js']
        },
        {
            displayName: 'e2e',
            testMatch: ['<rootDir>/tests/e2e/**/*.test.js'],
            testEnvironment: 'node',
            setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
            testTimeout: 60000
        }
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/$1"
    },
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { "presets": ["@babel/preset-env"] }]
    },
    globals: {
        "__DEV__": true,
        "electron": true
    }
};