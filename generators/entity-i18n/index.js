/* eslint-disable consistent-return */
const EntityI18nGenerator = require('generator-jhipster/generators/entity-i18n');
const debug = require('debug')('jhipster:multitenancy:entity-i18n');

const files = require('./files');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends EntityI18nGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important
    }

    get initializing() {
        return super._initializing();
    }

    get prompting() {
        return super._prompting();
    }

    get configuring() {
        const configuring = super._configuring();

        const myCustomPhaseSteps = {
            customConfigure() {
                if (this.isTenant) {
                    this.entityTranslationKey = `${this.entityTranslationKey}`;
                    this.entityTranslationKeyMenu = `${this.entityTranslationKeyMenu}`;
                }
            }
        };

        return Object.assign(configuring, myCustomPhaseSteps);
    }

    get default() {
        return super._default();
    }

    get writing() {
        const writing = super._writing();

        const myCustomPhaseSteps = {
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

        return Object.assign(writing, myCustomPhaseSteps);
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
