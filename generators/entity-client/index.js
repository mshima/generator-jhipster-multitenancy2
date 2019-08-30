/* eslint-disable consistent-return */
const EntityClientGenerator = require('generator-jhipster/generators/entity-client');

const mtUtils = require('../multitenancy-utils');
const files = require('./files');
const workarounds = require('../workarounds');

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        //        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        //        if (!this.jhipsterContext) {
        //            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint multitenancy2')}`);
        //        }

        //        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        //        jhContext.setupEntityOptions(this, jhContext, this);
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `EntityClientGenerator`
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
        const phaseFromJHipster = super._initializing();
        const myCustomPhaseSteps = {
            prepare() {
                if (this.isTenant) {
                    workarounds.fixAddEntityToModule(this);
                }
            }
        };
        return Object.assign(phaseFromJHipster, myCustomPhaseSteps);
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._prompting();
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        const phaseFromJHipster = super._writing();
        const myCustomPhaseSteps = {
            generateClientCode() {
                mtUtils.processPartialTemplates(files.angular.angularTemplates(this), this);
                if (this.isTenant) {
                    // this.addEntityToMenu(this.entityStateName, this.enableTranslation, this.clientFramework, this.entityTranslationKeyMenu);
                    if (!this.configOptions.tenantMenu) {
                        // Removes this condition when creating moves to entity-tenant, this is to ensure this is executed only once.
                        this.configOptions.tenantMenu = true;
                        this.addElementToAdminMenu(
                            `admin/${this.tenantNameLowerFirst}-management`,
                            'asterisk',
                            this.enableTranslation,
                            this.clientFramework,
                            `global.menu.admin.${this.tenantMenuTranslationKey}`
                        );
                    }

                    // tenant
                    mtUtils.processPartialTemplates(files.angular.tenantAngularTemplates(this), this);

                    // tests
                    mtUtils.processPartialTemplates(files.angular.angularTestTemplates(this), this);

                    // e2e test
                    if (this.testFrameworks.indexOf('protractor') !== -1) {
                        mtUtils.processPartialTemplates(files.angular.protractor(this), this);
                    }

                    files.writeFiles.call(this);

                    return;
                }
                if (this.tenantAware) {
                    mtUtils.processPartialTemplates(files.angular.tenantAwareAngularTemplates(this), this);
                }
            }
        };
        return Object.assign(phaseFromJHipster, myCustomPhaseSteps);
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
