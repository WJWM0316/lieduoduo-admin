module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'camelcase': 0,
    "arrow-body-style": [
      0,
      "as-needed"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "generator-star-spacing": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-param-reassign": 0,
    "no-multi-str": "off",
    "no-multiple-empty-lines": [
      "off",
      {
        "max": 1,
        "maxEOF": 0
      }
    ],
    "no-new-func": "off",
    "no-new-object": "off",
    "no-new-require": "off",
    "no-tabs": "off",
    "no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "args": "none",
        "ignoreRestSiblings": true
      }
    ]
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    },
    parser: 'babel-eslint'
  },
  "globals": {
    "mapActions": false,
    "mapGetters": false,
    "mapMutations": false,
    "mapState": false
  }
}
