const getNamingConventionRule = () => ({
  '@typescript-eslint/naming-convention': [
    1,
    {
      selector: [
        'function',
        'classProperty',
        'parameterProperty',
        'classMethod',
        'typeMethod',
        'accessor'
      ],
      format: ['camelCase'],
      leadingUnderscore: 'allow',
      trailingUnderscore: 'forbid',
      // Ignore `{'Retry-After': retryAfter}` type properties.
      filter: {
        regex: '[- ]',
        match: false
      }
    },
    {
      selector: 'variable',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      leadingUnderscore: 'forbid',
      trailingUnderscore: 'forbid'
    },
    {
      selector: 'variable',
      modifiers: ['const', 'exported'],
      types: ['boolean', 'string', 'number'],
      format: ['UPPER_CASE']
    },
    {
      selector: 'variable',
      types: ['boolean'],
      format: ['PascalCase'],
      prefix: ['is', 'has', 'can', 'should', 'will', 'did', 'are', 'supports']
    },
    {
      selector: 'typeLike',
      format: ['PascalCase']
    },
    {
      // Interface name should not be prefixed with `I`.
      selector: 'interface',
      filter: /^(?!I)[A-Z]/.source,
      format: ['PascalCase']
    },
    {
      // Type parameter name should either be `T` or a descriptive name.
      selector: 'typeParameter',
      filter: /^T$|^[A-Z][a-zA-Z]+$/.source,
      format: ['PascalCase']
    },
    // Allow these in non-camel-case when quoted.
    {
      selector: ['classProperty', 'objectLiteralProperty'],
      format: null,
      modifiers: ['requiresQuotes']
    }
  ]
})

module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  extends: ['react-app', 'plugin:react-hooks/recommended', 'prettier'],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        paths: ['.'],
        extensions: ['.js', '.jsx']
      },
      webpack: {}
    }
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  reportUnusedDisableDirectives: true,
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    'jsx-a11y/href-no-hash': 0,
    'no-console': 1,
    complexity: [2, 30],
    'prefer-object-spread': 2,
    'prefer-const': [2, { destructuring: 'all' }],
    'prefer-template': 2,
    'func-names': 2,
    'max-nested-callbacks': ['warn', 5],
    'new-cap': 0,
    'getter-return': 2,
    'for-direction': 2,
    'one-var-declaration-per-line': 2,
    'no-nested-ternary': 0,
    'no-new-object': 2,
    'no-label-var': 2,
    'no-delete-var': 2,
    'no-await-in-loop': 2,
    'no-async-promise-executor': 2,
    'no-underscore-dangle': 0,
    'no-extra-boolean-cast': 2,
    'no-shadow-restricted-names': 2,
    'no-undef-init': 2,
    'no-undef': 2,
    'no-unused-vars': 2,
    'no-cond-assign': 2,
    'no-loss-of-precision': 0,
    'no-eq-null': 2,
    yoda: [2, 'never'],
    'consistent-return': 0,
    eqeqeq: 2,
    'arrow-body-style': [2, 'as-needed'],
    radix: [2, 'always'],
    curly: [2, 'all'],
    'prefer-destructuring': [
      1,
      {
        // `array` is disabled because it forces destructuring on
        // stupid stuff like `foo.bar = process.argv[2];`
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: false,

          // Disabled because object assignment destructuring requires parens wrapping:
          // `let foo; ({foo} = object);`
          object: false
        }
      },
      { enforceForRenamedProperties: false }
    ],
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'any', prev: 'directive', next: 'directive' },
      { blankLine: 'always', prev: ['default'], next: '*' },
      {
        blankLine: 'always',
        prev: '*',
        next: [
          'try',
          'return',
          'if',
          'switch',
          'throw',
          'while',
          'for',
          'export',
          'do',
          'continue',
          'class'
        ]
      },
      { blankLine: 'any', prev: 'export', next: 'export' }
    ],
    'prefer-arrow-callback': [2, { allowNamedFunctions: true }],
    'prefer-numeric-literals': 2,
    'prefer-rest-params': 2,
    'prefer-spread': 2,
    'require-yield': 2,
    'symbol-description': 2,
    'spaced-comment': [2, 'always'],
    'guard-for-in': 2,
    'no-duplicate-imports': 2,
    'no-alert': 2,
    'no-debugger': 2,
    'no-useless-call': 2,
    'no-useless-return': 2,
    'no-useless-catch': 2,
    'no-useless-escape': 2,
    'no-useless-concat': 2,
    'no-caller': 2,
    'no-labels': 2,
    'no-eval': 2,
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'default-case': 2,
    'default-case-last': 2,
    'no-iterator': 2,
    'no-loop-func': 0,
    'no-multi-spaces': 2,
    'no-multi-str': 2,
    'no-new': 2,
    'no-param-reassign': 0,
    'no-proto': 2,
    'no-script-url': 2,
    'no-redeclare': 2,
    'no-import-assign': 2,
    'no-return-assign': 2,
    'no-return-await': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-throw-literal': 0,
    'no-unused-expressions': 2,
    'no-with': 2,
    'wrap-iife': [2, 'outside'],
    'valid-typeof': 2,
    'max-statements': 0,
    'max-statements-per-line': 2,
    'max-params': [1, { max: 6 }],
    'no-var': 0,
    'no-unexpected-multiline': 2,
    'dot-location': [2, 'property'],
    'no-unreachable': 2,
    'no-negated-in-lhs': 2,
    'no-irregular-whitespace': 2,
    'no-invalid-regexp': 2,
    'no-func-assign': 2,
    'no-extra-bind': 2,
    'no-extra-semi': 2,
    'no-ex-assign': 2,
    'no-empty': 2,
    'no-empty-pattern': 2,
    'no-duplicate-case': 2,
    'no-dupe-keys': 2,
    'no-dupe-args': 2,
    'no-dupe-else-if': 2,
    'no-constant-condition': 2,
    'no-unneeded-ternary': 2,
    'no-multi-assign': 2,
    'no-lonely-if': 2,
    'no-else-return': 2,
    'max-len': 0,
    'react/display-name': 1,
    'react/jsx-boolean-value': [2, 'never'],
    'react/jsx-no-undef': 2,
    'react/jsx-sort-prop-types': 0,
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: true,
        noSortAlphabetically: true
      }
    ],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/no-did-mount-set-state': 2,
    'react/no-did-update-set-state': 2,
    'react/no-unknown-property': [2, { ignore: ['css'] }],
    'react/prop-types': 0,
    'react/self-closing-comp': 2,
    'react/no-children-prop': 2,
    'react/sort-comp': [
      1,
      {
        order: [
          'static-methods',
          'lifecycle',
          '/^on.+$/',
          'everything-else',
          'render'
        ]
      }
    ],
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 0,
    'prettier/prettier': 2,
    'import/no-default-export': 2,
    'import/no-relative-parent-imports': 0,
    'no-restricted-imports': [2, { patterns: ['.*'] }]
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      env: { browser: true, es6: true, node: true },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      extends: ['react-app', 'plugin:react-hooks/recommended', 'prettier'],
      plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
      rules: {
        ...getNamingConventionRule(),
        'jsx-a11y/href-no-hash': 0,
        '@typescript-eslint/ban-types': [
          2,
          {
            extendDefaults: false,
            types: {
              String: {
                message: 'Use `string` instead.',
                fixWith: 'string'
              },
              Number: {
                message: 'Use `number` instead.',
                fixWith: 'number'
              },
              Boolean: {
                message: 'Use `boolean` instead.',
                fixWith: 'boolean'
              },
              Symbol: {
                message: 'Use `symbol` instead.',
                fixWith: 'symbol'
              },
              BigInt: {
                message: 'Use `bigint` instead.',
                fixWith: 'bigint'
              },
              Object: {
                message:
                  'The `Object` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead. See https://github.com/typescript-eslint/typescript-eslint/pull/848',
                fixWith: 'Record<string, unknown>'
              },
              '{}': {
                message:
                  'The `{}` type is mostly the same as `unknown`. You probably want `Record<string, unknown>` instead.',
                fixWith: 'Record<string, unknown>'
              },
              object: {
                message:
                  'The `object` type is hard to use. Use `Record<string, unknown>` instead. See: https://github.com/typescript-eslint/typescript-eslint/pull/848',
                fixWith: 'Record<string, unknown>'
              },
              Function:
                'Use a specific function type instead, like `() => void`.',
              '[]': "Don't use the empty array type `[]`. It only allows empty arrays. Use `SomeType[]` instead.",
              '[[]]':
                "Don't use `[[]]`. It only allows an array with a single element which is an empty array. Use `SomeType[][]` instead.",
              '[[[]]]': "Don't use `[[[]]]`. Use `SomeType[][][]` instead.",
              '[[[[]]]]': 'ur drunk 🤡',
              '[[[[[]]]]]': '🦄💥'
            }
          }
        ],
        '@typescript-eslint/no-empty-function': [
          2,
          { allow: ['private-constructors', 'protected-constructors'] }
        ],
        '@typescript-eslint/consistent-type-assertions': [
          2,
          {
            assertionStyle: 'as',
            objectLiteralTypeAssertions: 'allow-as-parameter'
          }
        ],
        '@typescript-eslint/no-throw-literal': [
          2,
          {
            // This should ideally be `false`, but it makes rethrowing errors inconvenient. There should be a separate `allowRethrowingUnknown` option.
            allowThrowingUnknown: true,
            allowThrowingAny: false
          }
        ],
        '@typescript-eslint/array-type': [2, { default: 'array' }],
        '@typescript-eslint/await-thenable': 2,
        '@typescript-eslint/no-shadow': 2,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-array-constructor': 2,
        '@typescript-eslint/no-dupe-class-members': 2,
        '@typescript-eslint/no-duplicate-enum-values': 2,
        '@typescript-eslint/no-extra-non-null-assertion': 2,
        '@typescript-eslint/no-loss-of-precision': 2,
        '@typescript-eslint/no-loop-func': 2,
        '@typescript-eslint/no-inferrable-types': 2,
        '@typescript-eslint/no-meaningless-void-operator': 2,
        '@typescript-eslint/no-namespace': 2,
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 2,
        '@typescript-eslint/no-non-null-asserted-optional-chain': 2,
        '@typescript-eslint/no-redundant-type-constituents': 2,
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 2,
        '@typescript-eslint/no-unnecessary-qualifier': 2,
        '@typescript-eslint/no-unnecessary-type-arguments': 2,
        '@typescript-eslint/no-unnecessary-type-assertion': 2,
        '@typescript-eslint/no-unnecessary-type-constraint': 2,
        '@typescript-eslint/no-useless-empty-export': 2,
        '@typescript-eslint/no-redeclare': [
          2,
          { ignoreDeclarationMerge: true }
        ],
        '@typescript-eslint/adjacent-overload-signatures': 2,
        '@typescript-eslint/consistent-indexed-object-style': 2,
        '@typescript-eslint/default-param-last': 2,
        '@typescript-eslint/type-annotation-spacing': 2,
        '@typescript-eslint/prefer-includes': 1,
        '@typescript-eslint/prefer-optional-chain': 1,
        '@typescript-eslint/prefer-reduce-type-parameter': 1,
        '@typescript-eslint/prefer-string-starts-ends-with': 1,
        'react/display-name': 0,
        'react/sort-comp': 0,
        'react-hooks/exhaustive-deps': 0,
        'import/no-webpack-loader-syntax': 0,
        'max-params': 0,
        'import/no-named-as-default': 2
      },
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          node: {
            paths: ['.'],
            extensions: ['.ts', '.tsx']
          },
          webpack: {}
        }
      }
    }
  ],
  globals: {
    jasmine: 'readonly'
  }
}
