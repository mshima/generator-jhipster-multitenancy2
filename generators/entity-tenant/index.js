/* eslint-disable consistent-return */
const EntityGenerator = require('generator-jhipster/generators/entity');

const mtUtils = require('../multitenancy-utils');
const workarounds = require('../workarounds');

workarounds.fixGetAllJhipsterConfig(EntityGenerator);

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        // current subgen
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.options.tenantName || this.config.get('tenantName'));

        // pass to entity-* subgen
        this.context.isTenant = this.isTenant;
    }

    get initializing() {
        const postInitializingSteps = {
            setUpVariables() {
                const context = this.context;

                if (context.enableTranslation === undefined) {
                    context.enableTranslation = this.configOptions.enableTranslation;
                }

                context.clientRootFolder = '../admin';
                // Maybe will be implemente for 6.2.1
                context.skipMenu = true;

                /* tenant variables */
                mtUtils.tenantVariables.call(this, this.config.get('tenantName'), context);
            }
        };

        return { ...super._initializing(), ...postInitializingSteps };
    }

    get prompting() {
        return {};
    }

    get configuring() {
        const preConfiguringSteps = {
            loadTenantDef() {
                this.context.clientRootFolder = '../admin';
            },
            preJson() {
                const context = this.context;

                // force tenant to be serviceClass
                context.service = 'serviceClass';
                context.changelogDate = this.config.get('tenantChangelogDate');

                context.fields.push({
                    fieldName: 'name',
                    fieldType: 'String',
                    fieldValidateRules: ['required']
                });

                context.relationships.push({
                    relationshipName: 'users',
                    otherEntityName: 'user',
                    relationshipType: 'one-to-many',
                    otherEntityField: 'login',
                    // relationshipValidateRules: 'required',
                    ownerSide: true,
                    otherEntityRelationshipName: context.tenantName
                });
            }
        };

        const postConfiguringSteps = {
            configureTenantFolder() {
                const context = this.context;

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
                // jhipster will override tenant's changelogDate
                if (!this.context.useConfigurationFile) {
                    this.context.changelogDate = this.config.get('tenantChangelogDate');
                    this.updateEntityConfig(this.context.filename, 'changelogDate', this.context.changelogDate);
                }
            }
        };
        return { ...preConfiguringSteps, ...super._configuring(), ...postConfiguringSteps };
    }

    get default() {
        // default phase doesn't exists on entity module
        return {};
    }

    get writing() {
        return super._writing();
    }

    get install() {
        return super._install();
    }

    get end() {
        // end phase doesn't exists on entity module
        return {};
    }
};
