/* eslint-disable consistent-return */
const EntityI18nGenerator = require('generator-jhipster/generators/entity-i18n');
const debug = require('debug')('jhipster:multitenancy:entity:i18n');

const GeneratorOverrides = require('../generator-overrides');

module.exports = class extends GeneratorOverrides(EntityI18nGenerator) {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        debug(`Initializing entity-i18n ${this.name}`);
    }

    get initializing() {
        return super._initializing();
    }

    get prompting() {
        return super._prompting();
    }

    get configuring() {
        return super._configuring();
    }

    get default() {
        return super._default();
    }

    get writing() {
        return super._writing();
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
