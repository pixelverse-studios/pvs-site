/* eslint-env node */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  }
};
