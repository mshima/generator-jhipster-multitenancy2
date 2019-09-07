/* eslint-disable consistent-return */
const EntityGenerator = require('generator-jhipster/generators/entity');
const debug = require('debug')('jhipster:multitenancy2:entity-tenant');

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

        debug('Initializing entity-tenant');
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
                const configuration = this.getAllJhipsterConfig(this, true);
                mtUtils.tenantVariables(configuration.get('tenantName'), context, this);
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

                if (!mtUtils.getArrayItemWithFieldValue(context.fields, 'fieldName', 'name')) {
                    context.fields.push({
                        fieldName: 'name',
                        fieldType: 'String',
                        fieldValidateRules: ['required']
                    });
                }

                if (!mtUtils.getArrayItemWithFieldValue(context.fields, 'relationshipName', 'users')) {
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
            }
        };

        const postConfiguringSteps = {
            configureTenantFolder() {
                const context = this.context;

                context.entityFolderName = context.tenantFolderName;
                context.entityFileName = context.tenantFileName;

                context.entityServiceFileName = context.tenantFileName;

                context.entityStateName = context.tenantStateName;
                context.entityUrl = context.entityStateName;

                context.entityTranslationKey = context.tenantTranslationKey;
                context.entityTranslationKeyMenu = context.tenantMenuTranslationKey;
                context.i18nKeyPrefix = `${context.angularAppName}.${context.entityTranslationKey}`;
                context.entityModelFileName = context.tenantFolderName;
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
