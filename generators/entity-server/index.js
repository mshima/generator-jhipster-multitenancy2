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
                    this.packageFolder = this.config.get('packageFolder');
                    // references to the various directories we'll be copying files to
                    this.javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;

                    // function to use directly template
                    this.template = function (source, destination) {
                        this.fs.copyTpl(
                                this.templatePath(source),
                                this.destinationPath(destination),
                                this
                        );
                    };

                    // template variables
                    mtUtils.tenantVariables(this.config.get('tenantName'), this);
                },
        };
        if(!isTenant) {
            const writeCustomPhaseSteps = {
                    customEntity() {
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
