/* eslint-disable consistent-return */
const chalk = require('chalk');
const ClientGenerator = require('generator-jhipster/generators/client');
//const writeFiles = require('./files').writeFiles;
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const mtUtils = require('../multitenancy-utils');
const partialFiles = require('./partials');

module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint multitenancy2')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupClientOptions(this, jhContext);
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `ClientGenerator`
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
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        const writing = super._writing()
        const myCustomPhaseSteps = {
            // sets up all the variables we'll need for the templating
            setUpVariables() {
                // function to use directly template
                this.template = function (source, destination) {
                    this.fs.copyTpl(
                        this.templatePath(source),
                        this.destinationPath(destination),
                        this
                    );
                };

                // Ok
                this.webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
                this.angularDir = jhipsterConstants.ANGULAR_DIR;
                this.clientTestDir = jhipsterConstants.CLIENT_TEST_SRC_DIR;
                // template variables
                mtUtils.tenantVariables(this.config.get('tenantName'), this);
            },
            // make the necessary client code changes and adds the tenant UI
            generateClientCode() {
                // configs for the template files
                const files = {
                    userManagement: [
                        {
                            path: this.angularDir,
                            templates: [
                                { file: 'admin/user-management/user-management.component.html', method: 'processHtml' },
                                { file: 'admin/user-management/user-management-detail.component.html', method: 'processHtml' },
                                { file: 'admin/user-management/user-management-update.component.ts', method: 'processJs' },
                                { file: 'admin/user-management/user-management-update.component.html', method: 'processHtml' },
                            ]
                        }
                    ],
                    tenantManagement: [
                        {
                            path: this.angularDir,
                            templates: [
                                {
                                    file: 'admin/tenant-management/_tenant-management.component.html',
                                    method: 'processHtml',
                                    template: true,
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management.component.html`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management-detail.component.html',
                                    method: 'processHtml',
                                    template: true,
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-detail.component.html`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management-delete-dialog.component.html',
                                    method: 'processHtml',
                                    template: true,
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-delete-dialog.component.html`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management.route.ts',
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management.route.ts`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant.model.ts',
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}.model.ts`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management.component.ts',
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management.component.ts`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management-delete-dialog.component.ts',
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-delete-dialog.component.ts`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management-detail.component.ts',
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-detail.component.ts`
                                },
                                {
                                    file: 'shared/tenant/_tenant.service.ts',
                                    renameTo: generator => `shared/${this.tenantNameLowerFirst}/${this.tenantNameLowerFirst}.service.ts`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management-update.component.ts',
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-update.component.ts`
                                },
                                {
                                    file: 'admin/tenant-management/_tenant-management-update.component.html',
                                    renameTo: generator => `admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-update.component.html`
                                }
                            ]
                        }
                    ],
                    admin: [
                        {
                            path: this.angularDir,
                            templates: [
                                { file: 'admin/admin.route.ts', method: 'processJs' },
                                'admin/admin.module.ts',
                            ]
                        }
                    ],
                    shared: [
                        {
                            path: this.angularDir,
                            templates: [
                                {
                                    file: 'core/auth/_tenant-route-access-service.ts',
                                    renameTo: generator => `core/auth/${this.tenantNameLowerFirst}-route-access-service.ts`
                                },
                                'shared/user/user.model.ts',
                                'core/user/user.model.ts'
                            ]
                        }

                    ],
                    tests: [
                        {
                            path: this.clientTestDir,
                            templates: [
                                {
                                    file: 'spec/app/admin/_tenant-management-detail.component.spec.ts',
                                    renameTo: generator => `spec/app/admin/${this.tenantNameLowerFirst}-management-detail.component.spec.ts`
                                }
                            ]
                        },
                        {
                            condition: generator => generator.protractorTests,
                            path: this.clientTestDir,
                            templates: [
                                {
                                    file: 'e2e/admin/_tenant-management.spec.ts',
                                    renameTo: generator => `e2e/admin/${this.tenantNameLowerFirst}-management.spec.ts`
                                }
                            ]
                        }
                    ]
                };

                // parse the templates and write files to the appropriate locations
                this.writeFilesToDisk(files, this, false);

                // Rewrites to existing files
                this.replaceContent(
                    `${this.webappDir}app/app.module.ts`,
                    'UserRouteAccessService } from \'./shared\';',
                    `UserRouteAccessService, ${this.tenantNameUpperFirst}RouteAccessService } from './shared';`,
                    'false'
                );
                this.rewriteFile(
                    `${this.webappDir}app/core/index.ts`,
                    'export * from \'./auth/user-route-access-service\';',
                    `export * from './auth/${this.tenantNameLowerFirst}-route-access-service';`
                );
                this.rewriteFile(
                    `${this.webappDir}app/admin/index.ts`,
                    'export * from \'./admin.route\';',
                    partialFiles.angular.appAdminIndexTs(this)
                );
                this.rewriteFile(
                    `${this.webappDir}app/layouts/navbar/navbar.component.html`,
                    'jhipster-needle-add-element-to-admin-menu',
                    partialFiles.angular.appLayoutsNavbarComponentHtml(this)
                );
                this.rewriteFile(
                    `${this.webappDir}app/layouts/navbar/navbar.component.ts`,
                    'getImageUrl() {',
                    partialFiles.angular.appLayoutsNavbarComponentTs(this)
                );
                this.rewriteFile(
                    `${this.webappDir}app/core/auth/account.service.ts`,
                    'getImageUrl(): string {',
                    partialFiles.angular.appAccountServiceTs(this)
                );
                this.rewriteFile(
                    `${this.webappDir}app/core/user/account.model.ts`,
                    'public imageUrl: string',
                    partialFiles.angular.appAccountModelTs(this)
                );
                this.rewriteFile(
                    `${this.webappDir}app/shared/index.ts`,
                    'export * from \'./util/datepicker-adapter\';',
                    `export * from './${this.tenantNameLowerFirst}/${this.tenantNameLowerFirst}.service';`
                );

                // Rewriting on tests
                if (this.protractorTests) {
                    const CLIENT_TEST_SRC_DIR = jhipsterConstants.CLIENT_TEST_SRC_DIR;
                    this.rewriteFile(
                        `${CLIENT_TEST_SRC_DIR}e2e/admin/administration.spec.ts`,
                        'it(\'should load metrics\', () => {',
                        partialFiles.angular.e2eAdminSpecTs(this)
                    );
                }
            },
            generateLanguageFiles() {
                if (this.enableTranslation) {
                    //this.addTranslationKeyToAllLanguages(`${this.tenantNameLowerFirst}-management`, `${this.tenantNameUpperFirst} Management`, 'addAdminElementTranslationKey', this.enableTranslation);
                    //this.addTranslationKeyToAllLanguages(`userManagement${this.tenantNameUpperFirst}`, `${this.tenantNameUpperFirst}`, 'addGlobalTranslationKey', this.enableTranslation);

                    // TODO: generate this file for each language
                    this.languages.forEach((language) => {
                        this.template('src/main/webapp/i18n/en/_tenant-management.json', `${this.webappDir}i18n/${language}/${this.tenantNameLowerFirst}-management.json`);
                    });
                }
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
