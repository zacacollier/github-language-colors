const fs = require('fs');
const got = require('got');

const YAML = require('yamljs');

function resultRemoveComments(result) {

  let resultCommentsRemoved = result.map((line) => {
    return !line.substring(0, 1).includes('#') ? line : null
  })
  .filter((line) => line !== null)
  .filter(each => each !== '' )
  .filter(each => each !== '---' )
  .join("\r\n");

  fs.writeFile('newColors.yaml', resultCommentsRemoved, (err) => {
    if (err) throw err;
  }, () => console.log(`Saved to ${arguments[0]}`));
}

got('https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml')
  .then(res => {
    // Remove Headers
    let splitResult = res.body.split(/\n/)
    resultRemoveComments(splitResult)
  })
  .catch(err => console.log(err))

