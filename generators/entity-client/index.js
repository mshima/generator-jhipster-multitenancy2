/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityClientGenerator = require('generator-jhipster/generators/entity-client');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const mtUtils = require('../multitenancy-utils');
const partialFiles = require('../entity/partials/index');

let isTenant;

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint multitenancy2')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupEntityOptions(this, jhContext, this);

        isTenant = (this._.lowerFirst(args[0]) === this._.lowerFirst(this.config.get("tenantName")));
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
        // Here we are not overriding this phase and hence its being handled by JHipster
//        const initializingFromJHipster = ;
//        const initializingCustomPhaseSteps = {
////                setUpVariables() {
////                },
//        }
        return super._initializing();
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._prompting();
    }

    get configuring() {
        //super.updateEntityConfig()
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        if (isTenant) return;
        var phaseFromJHipster = super._writing();
        var myCustomPhaseSteps = {
//            // sets up all the variables we'll need for the templating
            setUpVariables() {
                if (this.tenantAware) {
                    // tenancy already been configured
//                    this.tenancyExists = false;

                    this.packageFolder = this.config.get('packageFolder');
                    // function to use directly template
                    this.template = function (source, destination) {
                        this.fs.copyTpl(
                                this.templatePath(source),
                                this.destinationPath(destination),
                                this
                        );
                    };

                    // references to the various directories we'll be copying files to
                    this.javaDir = jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder + "/";

                    const context = this.context;

                    this.entityName = this.entityInstance;
                    this.entityNameUpperFirst = this.entityClass;

                    this.entityNameLowerFirst = this.entityInstance;
                    this.options.entityNameLowerFirst = this.entityInstance;

                }
            },
            generateClientCode() {
                if (this.tenantAware) {
                    const context = this.context;

                    mtUtils.tenantVariables(this.config.get('tenantName'), this);

                    const tenantNameUpperFirst = this.tenantNameUpperFirst;
                    const tenantNameLowerFirst = this.tenantNameLowerFirst;
                    const tenantNamePluralLowerFirst = this.tenantNamePluralLowerFirst;

                    const webappDir = this.CLIENT_MAIN_SRC_DIR;
                    const clientTestDir = jhipsterConstants.CLIENT_TEST_SRC_DIR;

                    const entityName = this.entityName;
                    const entityNamePlural = this.entityInstancePlural;
                    const entityNamePluralUpperFirst = this.entityClassPlural;
                    const protractorTests = this.testFrameworks.indexOf('protractor') !== -1;
                    const angularAppName = this.angularAppName;

                    this.angularAppName = angularAppName;
                    this.webappDir = webappDir;

                    mtUtils.processPartialTemplates(partialFiles.angular.templates(this), this);

                    // e2e test
                    if (protractorTests) {
                        mtUtils.processPartialTemplates(partialFiles.angular.testTemplates(this), this);
                    }

                    // i18n
                    if (this.enableTranslation) {
                        this.languages.forEach((language) => {
                            mtUtils.processPartialTemplates(partialFiles.angular.languageTemplates, this);

                            this.rewriteFile(
                                `${webappDir}i18n/${language}/${entityName}.json`,
                                '"detail": {',
                                `"${tenantNameLowerFirst}": "${tenantNameUpperFirst}",`
                            );
                        });
                    }
                }
            }
        }
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
