/* eslint-disable consistent-return */
const EntityI18nGenerator = require('generator-jhipster/generators/entity-i18n');
const debug = require('debug')('jhipster:multitenancy:entity-i18n');

const files = require('./files');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends EntityI18nGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important
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
            writeAdditionalEntries() {
                if (!this.enableTranslation || !this.isTenant) return;

                // templates
                debug(`Removing menu ${this.entityTranslationKeyMenu}: ${this.tenantNameUpperFirst}`);
                this.languages.forEach(language => {
                    this.language = language;
                    mtUtils.processPartialTemplates(files.i18n.i18nTemplates(this), this);
                });

                debug(`Adding menu ${this.tenantMenuTranslationKey}: ${this.tenantNameUpperFirst}`);
                this.addTranslationKeyToAllLanguages(
                    `${this.tenantMenuTranslationKey}`,
                    `${this.tenantNameUpperFirst}`,
                    'addAdminElementTranslationKey',
                    this.enableTranslation
                );
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
