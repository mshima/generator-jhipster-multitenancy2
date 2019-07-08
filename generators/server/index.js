/* eslint-disable consistent-return */
const chalk = require('chalk');
const ServerGenerator = require('generator-jhipster/generators/server');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const mtUtils = require('../multitenancy-utils');

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint multitenancy2')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupServerOptions(this, jhContext);
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `EntityServerGenerator`
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
        const initializing = super._initializing()
        const myCustomPhaseSteps = {
            // sets up all the variables we'll need for the templating
            setUpVariables() {
                this.jhiPrefixDashed = this._.kebabCase(this.jhiPrefix);
                this.angularXAppName = this.getAngularXAppName();
                this.jhiPrefixCapitalized = this._.upperFirst(this.jhiPrefix);
            },
        };
        return Object.assign(initializing, myCustomPhaseSteps);
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
        const myCustomPhaseSteps = {
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
                this.changelogDate = this.config.get("tenantChangelogDate");
            },
            // make the necessary server code changes
            generateServerCode() {
                // update user object
                this.template('src/main/java/package/domain/_User.java', `${this.javaDir}domain/User.java`);
                this.template('src/main/java/package/domain/_EntityParameter.java', `${this.javaDir}domain/${this.tenantNameUpperFirst}Parameter.java`);

                this.template('src/main/java/package/service/dto/_UserDTO.java', `${this.javaDir}service/dto/UserDTO.java`);

                // database changes
                this.template('src/main/resources/config/liquibase/changelog/_user_tenant_constraints.xml', `${this.resourceDir}config/liquibase/changelog/${this.changelogDate}__user_${this.tenantNameUpperFirst}_constraints.xml`);
                this.addChangelogToLiquibase(`${this.changelogDate}__user_${this.tenantNameUpperFirst}_constraints`);

                // copy over aspect
                this.template('src/main/java/package/aop/_tenant/_TenantAspect.java', `${this.javaDir}aop/${this.tenantNameLowerFirst}/${this.tenantNameUpperFirst}Aspect.java`);
                this.template('src/main/java/package/aop/_tenant/_UserAspect.java', `${this.javaDir}aop/${this.tenantNameLowerFirst}/UserAspect.java`);
            },
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
