const fs = require('fs');
const got = require('got');
const YAML = require('yamljs');
const chalk = require('chalk');
const Spinner = require('cli-spinner').Spinner;

function resultRemoveComments(result) {
  let resultCommentsRemoved = result.map((line) => {
    return !line.substring(0, 1).includes('#') ? line : null
  })
    .filter((line) => line !== null)
    .filter(each => each !== '' )
    .filter(each => each !== '---' )
    .join("\r\n");
  //convert to yaml
  writeToYaml(resultCommentsRemoved);
}

function writeToYaml(input) {
  const fileName = "gh-colors.yaml";
  fs.writeFile(fileName, input, 'utf8', (err) => {
    if (err) throw err;
    console.log(chalk.green(`Saved to ${fileName}`))
  });
}

got('https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml')
  .then(res => {
    // Remove Headers
    let splitResult = res.body.split(/\n/)
    resultRemoveComments(splitResult)
  })
  .catch(err => console.log(err))

