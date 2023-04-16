require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    '@vue/eslint-config-typescript',
  ],
  parserOptions: { ecmaVersion: 2020 },
  ignorePatterns: ['**/lang/*', '**/schemas/*', 'index.html', 'vite/*.config.ts', '.eslintrc.*'],
  rules: {
    // *** https://eslint.org/docs/latest/rules/ ***

    // === ESLint ===
    // Possible Problems
    'array-callback-return': ['error'],
    'no-duplicate-imports': ['error'],
    'no-self-compare': ['error'],

    // Suggestions
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: true }],
    'curly': ['error'],
    'default-case': ['error'],
    'default-case-last': ['error'],
    'dot-notation': ['error'],
    'eqeqeq': ['error'],
    'init-declarations': ['error'],
    'max-depth': ['error', 3],
    // 'max-line': ['error', 300],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['error', 2],
    'no-confusing-arrow': ['error'],
    'no-else-return': ['error', { allowElseIf: false }],
    'no-empty-function': ['error'],
    'no-extra-semi': ['error'],
    'no-lonely-if': ['error'],
    // 'no-magic-number': 'error',
    'no-mixed-operators': ['error'],
    'no-multi-assign': ['error'],
    'no-multi-str': ['error'],
    'no-param-reassign': ['error'],
    'no-plusplus': ['error'],
    'no-return-assign': ['error'],
    'no-return-await': ['error'],
    'no-useless-computed-key': ['error'],
    'no-useless-concat': ['error'],
    'no-useless-rename': ['error'],
    'no-useless-return': ['error'],
    'no-var': ['error'],
    'prefer-arrow-callback': ['error'],
    'prefer-const': ['error'],
    'prefer-template': ['error'],
    'quote-props': ['error', 'as-needed'],
    'require-await': ['error'],
    // 'sort-imports': 'error',

    // Layout and Formatting
    'array-bracket-newline': ['error', { multiline: true }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'block-spacing': ['error'],
    'brace-style': ['error'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error'],
    'comma-style': ['error'],
    'dot-location': ['error', 'property'],
    'eol-last': ['error', 'always'],
    'indent': ['error', 2, { ignoreComments: true, SwitchCase: 1 }],
    'key-spacing': ['error'],
    'keyword-spacing': ['error'],
    'max-len': ['error', { code: 150, ignoreComments: true }],
    'no-multi-spaces': ['error'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': ['error'],
    'no-whitespace-before-property': ['error'],
    'object-curly-newline': ['error', { multiline: true, minProperties: 3 }],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error'],
    'operator-linebreak': ['error', 'before'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
      { blankLine: 'always', prev: '*', next: ['if', 'switch', 'function'] },
      { blankLine: 'always', prev: ['if', 'switch', 'function'], next: '*' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'any', prev: 'import', next: 'import' },
    ],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'semi-spacing': ['error'],
    'semi-style': ['error'],
    'space-before-blocks': ['error'],
    'space-in-parens': ['error'],
    'template-curly-spacing': ['error'],
    
    // === Vue configs ===
    // Essential
    'vue/multi-word-component-names': 'off',

    // Strongly Recommend
    'vue/attribute-hyphenation': ['error'],
    'vue/first-attribute-linebreak': ['error'],
    'vue/max-attributes-per-line': ['error', { singleline: { max: 2 } }],
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/no-spaces-around-equal-signs-in-attribute': ['error'],

    // Recommend
    'vue/attributes-order': ['error'],
    'vue/component-tags-order': ['error', { 'order': ['template', 'script'] }],
    'vue/no-v-html': 'off',

    // === Typescript configs ===
    // '@typescript-eslint/no-explicit-any': 'error', => un comment this rule if you want to prevent any type
    '@typescript-eslint/no-unused-vars': ['error', {'varsIgnorePattern': 'import .'}],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // === ESLint ===
        'no-unused-vars': 'off',

        // === Typescript configs ===
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
