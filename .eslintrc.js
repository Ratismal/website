module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  // add your custom rules here
  "rules": {
    "strict": 0,
    "semi": "warn",
    "indent": [
      0,
      4
    ],
    "no-undef": 1,
    "no-global-assign": 1,
    "comma-dangle": "warn",
    "no-trailing-spaces": "warn",
    "vue/max-attributes-per-line": "off"
  },
}
