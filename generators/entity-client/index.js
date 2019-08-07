/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityClientGenerator = require('generator-jhipster/generators/entity-client');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const mtUtils = require('../multitenancy-utils');
const files = require('./files');

const CLIENT_MAIN_SRC_DIR = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

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

        isTenant = this.isTenant;
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
                    this._addEntityToModule = this.addEntityToModule;
                    this.addEntityToModule = function(
                        entityInstance,
                        entityClass,
                        entityName,
                        entityFolderName,
                        entityFileName,
                        entityUrl,
                        clientFramework,
                        microServiceName
                    ) {
                        /**
                         * Add a new admin in the TS modules file.
                         *
                         * @param {string} appName - Angular2 application name.
                         * @param {string} adminAngularName - The name of the new admin item.
                         * @param {string} adminFolderName - The name of the folder.
                         * @param {string} adminFileName - The name of the file.
                         * @param {boolean} enableTranslation - If translations are enabled or not.
                         * @param {string} clientFramework - The name of the client framework.
                         */

                        // addAdminToModule(appName, adminAngularName, adminFolderName, adminFileName, enableTranslation, clientFramework)
                        // this.addAdminToModule(this.angularXAppName, 'Company', 'company-management', 'company-management', this.enableTranslation, this.clientFramework);

                        const moduleNeedle = 'jhipster-needle-add-admin-module';
                        const appName = this.getAngularXAppName();
                        const entityAngularName = entityName;

                        const adminModulePath = `${CLIENT_MAIN_SRC_DIR}app/admin/admin.module.ts`;
                        const modulePath = `./${entityFolderName}/${entityFileName}.module`;

                        const moduleName = microServiceName
                            ? `${this.generator.upperFirstCamelCase(microServiceName)}${entityAngularName}Module`
                            : `${appName}${entityAngularName}Module`;
                        const splicable = `|RouterModule.forChild([
                                |            {
                                |                path: '${entityFileName}',
                                |                loadChildren: '${modulePath}#${moduleName}'
                                |            }]),`;

                        const errorMessage = `${chalk.yellow('Reference to ') + entityFileName + clientFramework} ${chalk.yellow(
                            `not added to ${modulePath}.\n`
                        )}`;

                        const moduleRewriteFileModel = this.needleApi.clientAngular.generateFileModel(
                            adminModulePath,
                            moduleNeedle,
                            this.stripMargin(splicable)
                        );
                        this.needleApi.clientAngular.addBlockContentToFile(moduleRewriteFileModel, errorMessage);
                    };
                    //                        this._generateRewriteFileModelAddModule = function(appName, angularName, modulePath, needle) {
                    //                            return this.generateFileModel(modulePath, needle, this.generator.stripMargin(splicable));
                    //                        }
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
                if (this.isTenant) {
                    // this.addEntityToMenu(this.entityStateName, this.enableTranslation, this.clientFramework, this.entityTranslationKeyMenu);
                    this.addElementToAdminMenu(
                        'admin/company-management',
                        'asterisk',
                        this.enableTranslation,
                        this.clientFramework,
                        'companyManagement'
                    );

                    // e2e test
                    if (this.testFrameworks.indexOf('protractor') !== -1) {
                        mtUtils.processPartialTemplates(files.angular.protractor(this), this);
                    }
                    files.writeFiles.call(this);

                    return;
                }
                if (this.tenantAware) {
                    mtUtils.processPartialTemplates(files.angular.templates(this), this);
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
