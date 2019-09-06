/* eslint-disable consistent-return */
const LanguagesGenerator = require('generator-jhipster/generators/languages');
const debug = require('debug')('jhipster:multitenancy2:languages');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const LanguagesPatcher = require('./files');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends LanguagesGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.patcher = new LanguagesPatcher();
        debug('Initializing languages blueprint');
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
        const postWritingSteps = {
            addTenantAdminMenuTranslation() {
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.config.get('tenantName'), this);
                this.CLIENT_MAIN_SRC_DIR = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
                this.languages.forEach(language => {
                    this.lang = language;
                    this.patcher.patch(this);
                });
            }
        };
        return { ...super._writing(), ...postWritingSteps };
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};