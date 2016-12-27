const fs = require('fs');
const YAML = require('yamljs');
const got = require('got');

got('https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml')
  .then(res => {
    console.log(res.body)
  })
  .catch(err => console.log(err))
