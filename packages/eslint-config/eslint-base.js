/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier', 'turbo'],
    plugins: ['@typescript-eslint/eslint-plugin'],
    parser: '@typescript-eslint/parser',
    ignorePatterns: [
        '.*.js',
        '**/*.json',
        '*.setup.js',
        '*.config.{mjs,js,ts}',
        '.turbo/',
        'dist/',
        'coverage/',
        'node_modules/',
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'turbo/no-undeclared-env-vars': 'warn',
    },
}
