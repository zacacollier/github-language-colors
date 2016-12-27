const fs = require('fs');
const got = require('got');

const YAML = require('yamljs');

got('https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml')
  .then(res => {
    console.log(res.body)
  })
  .catch(err => console.log(err))
