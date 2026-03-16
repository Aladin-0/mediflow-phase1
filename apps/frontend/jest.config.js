/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    },
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                moduleResolution: 'node',
                module: 'commonjs',
                jsx: 'react',
                strict: false,
                skipLibCheck: true,
                esModuleInterop: true,
            },
            diagnostics: false,
        }],
    },
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/__tests__/**/*.test.tsx',
    ],
    collectCoverageFrom: [
        'lib/**/*.ts',
        'hooks/**/*.ts',
        'store/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageReporters: ['text', 'json-summary'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    passWithNoTests: true,
};
