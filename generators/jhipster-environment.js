const Env = require('yeoman-environment');
const path = require('path');

const generatorPath = Env.lookupGenerator('jhipster:app');
const generatorsPath = path.dirname(path.dirname(generatorPath));
const packagePath = path.dirname(generatorsPath);
const utils = require(`${generatorsPath}/utils`);
const constants = require(`${generatorsPath}/generator-constants`);

const generator = function(generator) {
    return require(`${generatorsPath}/${generator}`);
};

module.exports = { packagePath, generatorsPath, utils, constants, generator };
