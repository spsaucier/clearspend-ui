module.exports = {
  extends: ['./configs/stylelint/order'],
  rules: {
    // recommended
    // https://github.com/stylelint/stylelint-config-recommended/blob/master/index.js
    'at-rule-no-unknown': [true, { ignoreAtRules: ['value'] }],
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'comment-no-empty': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'keyframe-declaration-no-important': true,
    'media-feature-name-no-unknown': true,
    'no-descending-specificity': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-invalid-double-slash-comments': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'string-no-newline': true,
    'unit-no-unknown': true,

    // standard
    // https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
    'at-rule-semicolon-space-before': 'never',
    'color-hex-length': 'short',
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    'comment-whitespace-inside': 'always',
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-block-single-line-max-declarations': 1,
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'function-name-case': 'lower',
    'function-parentheses-newline-inside': 'always-multi-line',
    'function-parentheses-space-inside': 'never-single-line',
    'function-whitespace-after': 'always',
    'length-zero-no-unit': true,
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['first-nested', 'blockless-after-same-name-blockless'],
      },
    ],
    'selector-attribute-quotes': 'always',
    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-operator-space-before': 'never',
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-type-case': 'lower',
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],

    // custom
    'selector-class-pattern': [
      '^[a-z0-9\\-]+$',
      {
        message: 'Selector should be written in lowercase with hyphens (selector-class-pattern)',
      },
    ],
    'shorthand-property-no-redundant-values': true,
  },
};
