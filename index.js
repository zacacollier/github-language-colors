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
    else {
    console.log(chalk.green(`Saved to ${fileName}`));
    convertToJSON(fileName);
    }
  });
}

const convertToJSON = (input, pretty = true, save = true, spaces = 2, str = null) => {
  spinner.setSpinnerTitle(chalk.yellow('Converting to JSON... %s'));
  spinner.start();
  let json;
  //if (spaces == null) spaces = 2;
  if (str != null) {
      if (pretty) {
          json = JSON.stringify(YAML.parse(str), null, spaces);
      }
      else {
          json = JSON.stringify(YAML.parse(str));
      }
  } else {
      if (pretty) {
          json = JSON.stringify(YAML.parseFile(input), null, spaces);
      }
      else {
          json = JSON.stringify(YAML.parseFile(input));
      }
  }

  if (!save || input == null) {
      process.stdout.write(json+"\n");
  }
  else {
      let output;
      if (input.substring(input.length-4) == '.yml') {
          output = input.substr(0, input.length-4) + '.json';
      }
      else if (input.substring(input.length-5) == '.yaml') {
          output = input.substr(0, input.length-5) + '.json';
      }
      else {
          output = input + '.json';
      }

      // Write to .json
      let file = fs.openSync(output, 'w+');
      fs.writeSync(file, json);
      fs.closeSync(file);
      spinner.stop();
      console.log(chalk.cyan(`Converted yaml, saved to gh-colors.json`));
  }
};

got(url)
  .then(res => {
    // Remove Headers
    spinner.stop(!!res);
    let splitResult = res.body.split(/\n/);
    resultRemoveComments(splitResult);
  })
  .catch(err => console.log(chalk.red(err)))

