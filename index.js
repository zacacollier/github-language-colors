const fs = require('fs');
const got = require('got');
const YAML = require('yamljs');
const chalk = require('chalk');
const Spinner = require('cli-spinner').Spinner;

//bind to variable to easily support other address locations
const url = 'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';

// interesting - when you place a '\n' into the string, it prints a bunch of
// new lines...
const spinner = new Spinner(chalk.yellow('Fetching... %s'));
spinner.setSpinnerString(19);
spinner.start();

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


got(url)
  .then(res => {
    // Remove Headers
    spinner.stop(!!res);
    spinner.setSpinnerTitle(chalk.yellow('Fetched YAML, converting to JSON...'));
    let splitResult = res.body.split(/\n/);
    resultRemoveComments(splitResult);
  })
  .catch(err => console.log(chalk.red(err)))

