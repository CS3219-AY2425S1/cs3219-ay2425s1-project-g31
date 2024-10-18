/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['./eslint-base.js'],
    env: {
        node: true,
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['**/__tests__/**/*'],
            env: {
                jest: true,
            },
        },
    ],
}
