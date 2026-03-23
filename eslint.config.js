const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const jsdoc = require('eslint-plugin-jsdoc')

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      jsdoc,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        // Default: camelCase
        { selector: 'default', format: ['camelCase'] },
        // Variables: camelCase or UPPER_CASE; allow single leading underscore for unused.
        // Excludes __double_underscore__ injected globals (handled separately below).
        {
          selector: 'variable',
          filter: { regex: '^__.*__$', match: false },
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        // __double_underscore__ injected globals (esbuild define, Figma __html__): no format restriction
        {
          selector: 'variable',
          filter: { regex: '^__.*__$', match: true },
          format: null,
        },
        // Parameters: allow leading underscore for unused params
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        // Functions: camelCase or PascalCase (React/Preact components)
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        // Types, interfaces, classes, enums: PascalCase
        { selector: 'typeLike', format: ['PascalCase'] },
        // Enum members: UPPER_CASE or PascalCase
        { selector: 'enumMember', format: ['UPPER_CASE', 'PascalCase'] },
        // Object properties: no restrictions (external APIs, Figma API, etc.)
        { selector: 'property', format: null },
        // Imports: camelCase or PascalCase (library class names like JSZip)
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
      ],

      // JSDoc: require on all exported functions and class methods
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: false,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          // Also require on exported arrow functions (hooks, utilities)
          checkConstructors: false,
          publicOnly: false,
        },
      ],
      // Require @param and @returns tags when present in JSDoc
      'jsdoc/require-param': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-returns-description': 'warn',
      // Description must not be empty
      'jsdoc/require-description': ['warn', { descriptionStyle: 'body' }],
    },
  },
]
