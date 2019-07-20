/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityGenerator = require('generator-jhipster/generators/entity');

const pluralize = require('pluralize');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const mtUtils = require('../multitenancy-utils');
const partialFiles = require('./partials/index');

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint multitenancy2')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupEntityOptions(this, jhContext, this);

        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.config.get("tenantName"));
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `EntityGenerator`
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
        const postCustomPhaseSteps = {
                setUpVariables() {
                    this.tenantName = this.config.get("tenantName");
                    const context = this.context;

                    if(this.isTenant && !context.fileData){
                        context.service = 'serviceClass';
                        context.pagination = 'pagination';
                        context.changelog = this.config.get("tenantChangelogDate");

                        context.fields = [{
                            fieldName: 'name',
                            fieldType: 'String',
                            fieldValidateRules: [
                                'required'
                                ]
                        }];

                        context.relationships = [{
                            relationshipName: 'users',
                            otherEntityName: 'user',
                            relationshipType: 'one-to-many',
                            otherEntityField: 'login',
                            relationshipValidateRules: 'required',
                            ownerSide: true,
                            otherEntityRelationshipName: this._.toLower(this.tenantName)
                        }];
                    }
                },
        }

        return Object.assign(phaseFromJHipster, postCustomPhaseSteps);
    }

    get prompting() {
        const prompting = super._prompting()
        const myCustomPhaseSteps = {
            askTenantAware() {
                const context = this.context;
                const isTenant = this.isTenant;
                const prompts = [
                    {
                        when: ((context.fileData === undefined || context.fileData.tenantAware === undefined) && !isTenant),
                        type: 'confirm',
                        name: 'tenantAware',
                        message: `Do you want to make ${context.name} tenant aware?`,
                        default: false
                    }
                    ];
                const done = this.async();
                this.prompt(prompts).then(props => {
                    if(!isTenant && props.tenantAware !== undefined){
                        this.newTenantAware = props.tenantAware;
                    }
                    done();
                });
            }
        };
        return Object.assign(myCustomPhaseSteps);
    }

    get configuring() {
        const myCustomPrePhaseSteps = {
                loadTenantDef() {
                    const context = this.context;
                    this.tenantName = this.config.get('tenantName');
                    //this.isTenant = this.isTenant || (this._.lowerFirst(context.name) === this._.lowerFirst(this.config.get("tenantName")));

                    if (this.newTenantAware === undefined){
                        this.context.tenantAware = context.fileData ? context.fileData.tenantAware : false;
                    }else {
                        this.context.tenantAware = this.newTenantAware;
                    }
                    /* tenant variables */
                    mtUtils.tenantVariables(this.tenantName, this);
                },
                preJson() {
                    if(this.isTenant) return;

                    const context = this.context;

                    if(this.context.tenantAware){
                        context.service = 'serviceClass';

                        const relationships = context.relationships;
                        // if any relationship exisits already in the entity to the tenant remove it and regenerated
                        for (let i = relationships.length - 1; i >= 0; i--) {
                            if (relationships[i].otherEntityName === this.tenantName) {
                                relationships.splice(i);
                            }
                        }

                        this.log(chalk.white(`Entity ${chalk.bold(this.options.name)} found. Adding relationship`));
                        const real = {
                            relationshipName: this._.toLower(this.tenantName),
                            otherEntityName: this._.toLower(this.tenantName),
                            relationshipType: 'many-to-one',
                            otherEntityField: 'id',
                            relationshipValidateRules: 'required',
                            ownerSide: true,
                            otherEntityRelationshipName: this._.toLower(context.name)
                        };
                        relationships.push(real);
                    }
                },
        }
        const configuring = super._configuring();

        const myCustomPostPhaseSteps = {
                postJson() {
                    if(this.isTenant) return;

                    // super class creates a new file without tenantAware (6.1.2)
                    this.updateEntityConfig(this.context.filename, 'tenantAware', this.context.tenantAware);
                },
        }
        return Object.assign(myCustomPrePhaseSteps, configuring, myCustomPostPhaseSteps);
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        var phaseFromJHipster = super._writing();
        var myCustomPhaseSteps = {
//            // sets up all the variables we'll need for the templating
            setUpVariables() {
            },
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
