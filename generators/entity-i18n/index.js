/* eslint-disable consistent-return */
const EntityI18nGenerator = require('generator-jhipster/generators/entity-i18n');
const debug = require('debug')('jhipster:multitenancy:entity-i18n');

const files = require('./files');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends EntityI18nGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        //        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        //        if (!this.jhipsterContext) {
        //            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint multitenancy2')}`);
        //        }

        //        this.configOptions = jhContext.configOptions || {};
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `EntityI18nGenerator`
         *
         * There are multiple ways to customize a phase from JHipster.
         *
         * 1. Let JHipster handle a phase, blueprint doesnt override anything.
         * ```
         *      return super._initializing();
         * ```
         *
         * 2. Override the entire phase, this is when the blueprint takes control of a phase
         * ```
         *      return {
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *          myAnotherCustomInitPhaseStep(){
         *              // Do all your stuff here
         *          }
         *      };
         * ```
         *
         * 3. Partially override a phase, this is when the blueprint gets the phase from JHipster and customizes it.
         * ```
         *      const phaseFromJHipster = super._initializing();
         *      const myCustomPhaseSteps = {
         *          displayLogo() {
         *              // override the displayLogo method from the _initializing phase of JHipster
         *          },
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *      }
         *      return Object.assign(phaseFromJHipster, myCustomPhaseSteps);
         * ```
         */
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
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
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        // TODO copy generated files instead of creating ours
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
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._install();
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }
};
