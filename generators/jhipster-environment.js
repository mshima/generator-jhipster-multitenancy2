const Env = require('yeoman-environment');
const path = require('path');
const chalk = require('chalk');

const autoExtender = require('./auto-extender');

const generatorPath = Env.lookupGenerator('jhipster:app');
const generatorsPath = path.dirname(path.dirname(generatorPath));
const packagePath = path.dirname(generatorsPath);
const utils = require(`${generatorsPath}/utils`);
const constants = require(`${generatorsPath}/generator-constants`);
const jhipsterVersion = require(`${packagePath}/package.json`).version;

console.log(`\nExtending peer generator-jhipster version ${chalk.yellow(`${jhipsterVersion}`)} at ${chalk.yellow(`${generatorsPath}`)}\n`);

const generator = function(generator) {
    return autoExtender(require(`${generatorsPath}/${generator}`));
};

module.exports = { packagePath, generatorsPath, utils, constants, generator, jhipsterVersion };
