module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["mixin", "include","extend"]
      }
    ],
    // "order/properties-order": null,
    "declaration-empty-line-before": null,
    "no-descending-specificity": null
  }
};
