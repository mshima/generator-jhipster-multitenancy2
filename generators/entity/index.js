/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityGenerator = require('generator-jhipster/generators/entity');
const debug = require('debug')('jhipster:multitenancy2:entity');

const mtUtils = require('../multitenancy-utils');
const GeneratorOverrides = require('../generator-extender');

module.exports = class extends GeneratorOverrides(EntityGenerator) {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.option('tenant-root-folder', {
            desc: 'Set tenant root folder',
            type: String,
            default: '../admin'
        });

        // current subgen
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.config.get('tenantName'));

        // pass to entity-* subgen
        this.context.isTenant = this.isTenant;
        debug(`Initializing entity ${args[0]}`);
    }

    get initializing() {
        const postInitializingSteps = {
            setUpVariables() {
                const context = this.context;

                if (context.enableTranslation === undefined) {
                    context.enableTranslation = this.configOptions.enableTranslation;
                }

                // Ignore some questions and validations
                if (this.isJhipsterVersionLessThan('6.3.0')) {
                    // needed for changelogDate.
                    context.useConfigurationFile = true;
                }

                /* tenant variables */
                mtUtils.tenantVariables.call(this, this.config.get('tenantName'), context, this);

                if (!this.isTenant) {
                    return;
                }

                mtUtils.validateTenant(this);
            }
        };

        return { ...super._initializing(), ...postInitializingSteps };
    }

    get prompting() {
        const postPromptingSteps = {
            askTenantAware() {
                const context = this.context;

                if (this.isTenant) return;

                // tenantAware is already defined
                if (context.fileData !== undefined && context.fileData.tenantAware !== undefined) {
                    return;
                }

                let defaultValue = false;

                if (this.options.defaultTenantAware !== undefined) {
                    this.newTenantAware = this.options.defaultTenantAware;
                } else if (this.options.relationTenantAware) {
                    // look for tenantAware entities
                    // eslint-disable-next-line prettier/prettier
                    this.newTenantAware = mtUtils.getArrayItemWithFieldValue(context.relationships, 'otherEntityName', context.tenantName) !== undefined;
                } else {
                    // eslint-disable-next-line prettier/prettier
                    defaultValue = mtUtils.getArrayItemWithFieldValue(context.relationships, 'otherEntityName', context.tenantName) !== undefined;
                }

                const prompts = [
                    {
                        when: this.newTenantAware === undefined,
                        type: 'confirm',
                        name: 'tenantAware',
                        message: `Do you want to make ${context.name} tenant aware?`,
                        default: defaultValue
                    }
                ];
                const done = this.async();
                this.prompt(prompts).then(props => {
                    if (!this.isTenant && props.tenantAware !== undefined) {
                        this.newTenantAware = props.tenantAware;
                    }
                    done();
                });
            }
        };
        return { ...super._prompting(), ...postPromptingSteps };
    }

    get configuring() {
        const preConfiguringSteps = {
            loadTenantDef() {
                const context = this.context;

                // pass to entity-* subgen
                if (this.newTenantAware === undefined) {
                    context.tenantAware = context.fileData ? context.fileData.tenantAware : false;
                } else {
                    context.tenantAware = this.newTenantAware;
                }

                if (this.isTenant) {
                    context.clientRootFolder = context.tenantClientRootFolder;
                }
            },
            preJson() {
                const context = this.context;

                if (this.isTenant) {
                    // force tenant to be serviceClass
                    context.service = 'serviceClass';
                    context.changelogDate = this.config.get('tenantChangelogDate');
                    return;
                }

                if (this.context.tenantAware) {
                    context.service = 'serviceClass';

                    const tenantRelationship = mtUtils.getArrayItemWithFieldValue(
                        context.relationships,
                        'otherEntityName',
                        context.tenantName
                    );

                    // if tenant relationship already exists in the entity then set options
                    if (tenantRelationship) {
                        debug('Found relationship with tenant');
                        // Force values
                        tenantRelationship.ownerSide = true;
                        tenantRelationship.relationshipValidateRules = 'required';

                        if (!tenantRelationship.relationshipType) {
                            tenantRelationship.relationshipType = 'many-to-one';
                        }
                        if (!tenantRelationship.otherEntityField) {
                            tenantRelationship.otherEntityField = 'name';
                        }
                        if (!tenantRelationship.clientRootFolder) {
                            tenantRelationship.clientRootFolder = context.tenantClientRootFolder;
                        }
                        if (!tenantRelationship.otherEntityStateName) {
                            tenantRelationship.otherEntityStateName = context.tenantStateName;
                        }
                        if (!tenantRelationship.otherEntityFolderName) {
                            tenantRelationship.otherEntityFolderName = context.tenantFolderName;
                        }
                        if (!tenantRelationship.otherEntityAngularName) {
                            tenantRelationship.otherEntityAngularName = context.tenantAngularName;
                        }
                        if (!tenantRelationship.otherEntityRelationshipName) {
                            tenantRelationship.otherEntityRelationshipName = context.tenantInstance;
                        }
                        return;
                    }

                    this.log(chalk.white(`Entity ${chalk.bold(this.options.name)} found. Adding relationship`));
                    const real = {
                        relationshipName: context.tenantName,
                        otherEntityName: context.tenantName,
                        relationshipType: 'many-to-one',
                        otherEntityField: 'name',
                        relationshipValidateRules: 'required',
                        ownerSide: true,
                        clientRootFolder: context.tenantClientRootFolder,
                        otherEntityStateName: context.tenantStateName,
                        otherEntityFolderName: context.tenantFolderName,
                        otherEntityAngularName: context.tenantAngularName,
                        otherEntityRelationshipName: context.tenantInstance
                    };
                    context.relationships.push(real);
                }
            }
        };

        const postConfiguringSteps = {
            configureTenantFolder() {
                const context = this.context;

                if (!this.isTenant) return;

                context.entityFolderName = context.tenantFolderName;
                context.entityFileName = context.tenantFileName;

                context.entityServiceFileName = context.tenantFileName;

                context.entityStateName = context.tenantStateName;
                context.entityUrl = context.entityStateName;
                // context.entityStateName = context.tenantStateName;
                // context.entityUrl = context.tenantStateName;

                context.entityTranslationKey = context.tenantTranslationKey;
                context.entityTranslationKeyMenu = context.tenantMenuTranslationKey;
                context.i18nKeyPrefix = `${context.angularAppName}.${context.entityTranslationKey}`;
                context.entityModelFileName = context.tenantFolderName;
            },
            postJson() {
                if (this.context.tenantAware) {
                    if (this.configOptions.tenantAwareEntities === undefined) {
                        this.configOptions.tenantAwareEntities = [];
                    }
                    this.configOptions.tenantAwareEntities.push(this.context.entityClass);
                }

                this.log(chalk.white(`Saving ${chalk.bold(this.options.name)} tenantAware`));
                // Super class creates a new file without tenantAware (6.1.2), so add tenantAware to it.
                this.updateEntityConfig(this.context.filename, 'tenantAware', this.context.tenantAware);
            }
        };
        return { ...preConfiguringSteps, ...super._configuring(), ...postConfiguringSteps };
    }

    get default() {
        return super._default();
    }

    get writing() {
        return super._writing();
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
