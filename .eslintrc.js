module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'unused-imports'],
  rules: {
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'arrow-body-style': ['error', 'as-needed'],
    'no-console': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
