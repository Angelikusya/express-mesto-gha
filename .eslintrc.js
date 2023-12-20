{
  "extends": "airbnb-base",
  "rules": {
    "no-console": "off",
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": false, "optionalDependencies": false, "peerDependencies": false}]
  }
}
