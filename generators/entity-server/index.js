/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityServerGenerator = require('generator-jhipster/generators/entity-server');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const mtUtils = require('../multitenancy-utils');
const partialFiles = require('./partials');

let isTenant;
let isTenantAware;

module.exports = class extends EntityServerGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint multitenancy2')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        if (jhContext.databaseType === 'cassandra') {
            this.pkType = 'UUID';
        }

        isTenant = (this._.lowerFirst(args[0]) === this._.lowerFirst(this.config.get("tenantName")));
        isTenantAware = this.tenantAware || false;
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `ServerGenerator`
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
        const writing = super._writing();
        if(!isTenant && !isTenantAware) return writing;

        const setupCustomPhaseSteps = {
                // sets up all the variables we'll need for the templating
                setUpVariables() {
                    // references to the various directories we'll be copying files to
                    this.javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
                    this.resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
                    this.webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
                    this.angularDir = jhipsterConstants.ANGULAR_DIR;
                    this.testDir = jhipsterConstants.SERVER_TEST_SRC_DIR + this.packageFolder;
                    this.clientTestDir = jhipsterConstants.CLIENT_TEST_SRC_DIR;

                    // template variables
                    mtUtils.tenantVariables(this.config.get('tenantName'), this);
                    this.tenantisedEntityServices = `@Before("execution(* ${this.packageName}.service.UserService.*(..))")`;
                    this.mainClass = this.getMainClassName();
                },
        };
        if(!isTenant) {
            const writeCustomPhaseSteps = {
                    customEntity() {
                        this.entityNameUpperFirst = this.entityClass;
                        this.entityNameLowerFirst = this.entityInstance;
                        this.entityNamePlural = this.entityInstancePlural;
                        this.template('_EntityAspect.java', `${this.javaDir}aop/${this.tenantNameLowerFirst}/${this.entityClass}Aspect.java`);

                        mtUtils.processPartialTemplates(partialFiles.serverEntityTenantAware.templates(this), this);
                    },
            }
            return Object.assign(writing, setupCustomPhaseSteps, writeCustomPhaseSteps);
        }

        const writeCustomPhaseSteps = {
                // make the necessary server code changes
                customServerCode() {
                    this.replaceContent(
                            `${this.javaDir}service/${this.tenantNameUpperFirst}Service.java`,
                            `return ${this.tenantNameLowerFirst}Repository.findById(id);`,
                            partialFiles.server.tenantService(this),
                            false
                    );

                    this.replaceContent(`${this.javaDir}domain/${this.tenantNameUpperFirst}.java`,
                            `    @OneToMany(mappedBy = "'${this.tenantNameLowerFirst}'")`,
                    `\t@OneToMany(mappedBy = "'${this.tenantNameLowerFirst}'", fetch = FetchType.EAGER)`);

                    this.rewriteFile(`${this.javaDir}web/rest/${this.tenantNameUpperFirst}Resource.java`,
                            `${this.tenantNameLowerFirst}Service.delete(id);`,
                            partialFiles.server.tenantResource(this));

                    this.template('src/main/java/package/repository/_TenantRepository.java',
                    `${this.javaDir}repository/${this.tenantNameUpperFirst}Repository.java`);
                },
        };
        return Object.assign(writing, setupCustomPhaseSteps, writeCustomPhaseSteps);
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
