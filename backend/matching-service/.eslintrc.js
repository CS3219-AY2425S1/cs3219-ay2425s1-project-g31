/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['@repo/eslint-config/eslint-service.js'],
    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
}
