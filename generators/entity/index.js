/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityGenerator = require('generator-jhipster/generators/entity');

const mtUtils = require('../multitenancy-utils');
const workarounds = require('../workarounds');

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        // current subgen
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.config.get('tenantName'));

        // pass to entity-* subgen
        this.context.isTenant = this.isTenant;

        // Workaround https://github.com/jhipster/generator-jhipster/issues/10205
        workarounds.fixGetAllJhipsterConfig(this);
    }

    get initializing() {
        const postInitializingSteps = {
            setUpVariables() {
                const context = this.context;

                if (context.enableTranslation === undefined) {
                    context.enableTranslation = this.configOptions.enableTranslation;
                }

                if (this.isTenant) {
                    // Ignore questions to the tenant
                    context.useConfigurationFile = true;

                    context.clientRootFolder = '../admin';
                    // Maybe will be implemente for 6.2.1
                    context.skipMenu = true;
                }

                /* tenant variables */
                mtUtils.tenantVariables.call(this, this.config.get('tenantName'), context);

                if (!this.isTenant) {
                    // if tenantAware is undefined (first pass), then override changelogDate
                    if (context.fileData && context.fileData.tenantAware === undefined) {
                        const nextChangelogDate = this.config.get('nextChangelogDate');
                        if (nextChangelogDate !== undefined) {
                            context.changelogDate = `${Number(nextChangelogDate) + 1}`;
                            this.config.set('nextChangelogDate', context.changelogDate);
                        }
                    }
                    return;
                }

                // We should force some tenant options.
                if (context.fileData) {
                    context.service = 'serviceClass';
                    context.changelogDate = this.config.get('tenantChangelogDate');

                    let containsName = false;

                    context.fields.forEach(field => {
                        if (field.fieldName !== undefined && this._.toLower(field.fieldName) === 'name') {
                            containsName = true;
                        }
                    });
                    if (!containsName) {
                        context.fields.push({
                            fieldName: 'name',
                            fieldType: 'String',
                            fieldValidateRules: ['required']
                        });
                    }

                    let containsUsers = false;
                    context.relationships.forEach(relationship => {
                        if (relationship.relationshipName !== undefined && this._.toLower(relationship.relationshipName) === 'users') {
                            containsUsers = true;
                        }
                    });
                    if (!containsUsers) {
                        context.relationships.push({
                            relationshipName: 'users',
                            otherEntityName: 'user',
                            relationshipType: 'one-to-many',
                            otherEntityField: 'login',
                            relationshipValidateRules: 'required',
                            ownerSide: true,
                            otherEntityRelationshipName: context.tenantName
                        });
                    }
                }
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

                // look for tenantAware entities
                let relationWithTenant = false;

                if (this.options.defaultTenantAware !== undefined) {
                    this.newTenantAware = this.options.defaultTenantAware;
                } else if (this.options.relationTenantAware) {
                    // Always use relation value if exists
                    if (context.fileData !== undefined && context.fileData.relationships !== undefined) {
                        context.relationships.forEach(field => {
                            if (this._.toLower(field.otherEntityName) === this._.toLower(context.tenantName)) {
                                relationWithTenant = true;
                            }
                        });
                    }
                    this.newTenantAware = relationWithTenant;
                }

                const prompts = [
                    {
                        when: this.newTenantAware === undefined,
                        type: 'confirm',
                        name: 'tenantAware',
                        message: `Do you want to make ${context.name} tenant aware?`,
                        default: relationWithTenant
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
                    context.clientRootFolder = '../admin';
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

                    const relationships = context.relationships;

                    let tenantRelationship;
                    // if any relationship exisits already in the entity to the tenant remove it and regenerated
                    for (let i = relationships.length - 1; i >= 0; i--) {
                        if (relationships[i].otherEntityName === context.tenantName) {
                            tenantRelationship = relationships[i];
                        }
                    }

                    if (tenantRelationship) {
                        if (!tenantRelationship.clientRootFolder) {
                            tenantRelationship.clientRootFolder = '../admin';
                        }
                        if (!tenantRelationship.otherEntityStateName) {
                            tenantRelationship.otherEntityStateName = context.tenantStateName;
                        }
                        if (!tenantRelationship.otherEntityFolderName) {
                            tenantRelationship.otherEntityFolderName = context.tenantFolderName;
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
                        clientRootFolder: '../admin',
                        otherEntityStateName: context.tenantStateName,
                        otherEntityFolderName: context.tenantFolderName,
                        otherEntityRelationshipName: context.tenantInstance
                    };
                    relationships.push(real);
                }
            }
        };

        const postConfiguringSteps = {
            configureTenantFolder() {
                const context = this.context;

                if (!this.isTenant) return;

                // Angular client
                // `entities/${generator.entityFolderName}/${generator.entityFileName}`
                // Tests
                // `spec/app/entities/${generator.entityFolderName}/${generator.entityFileName}
                // Protractor
                // `e2e/entities/${generator.entityFolderName}/${generator.entityFileName}`
                context.entityFolderName += '-management';
                context.entityFileName += '-management';

                // Angular service
                // entities/${generator.entityFolderName}/${generator.entityServiceFileName}.service.ts
                context.entityServiceFileName += '-management';

                context.entityStateName += '-management';
                context.entityUrl = `admin/${context.entityStateName}`;

                // Angular model
                // `shared/model/${generator.entityModelFileName}.model.ts`
                // this.entityModelFileName = this.entityModelFileName;
            },
            postJson() {
                if (this.isTenant) {
                    // jhipster will override tenant's changelogDate
                    if (!this.context.useConfigurationFile) {
                        this.context.changelogDate = this.config.get('tenantChangelogDate');
                        this.updateEntityConfig(this.context.filename, 'changelogDate', this.context.changelogDate);
                    }
                    return;
                }

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
