/* eslint-disable consistent-return */
const EntityGenerator = require('generator-jhipster/generators/entity');
const debug = require('debug')('jhipster:multitenancy2:entity-tenant');

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
        this.isTenant = this._.lowerFirst(args[0]) === this._.lowerFirst(this.options.tenantName || this.config.get('tenantName'));

        // pass to entity-* subgen
        this.context.isTenant = this.isTenant;

        debug(`Initializing entity-tenant ${args[0]}`);
    }

    get initializing() {
        const postInitializingSteps = {
            setUpVariables() {
                const context = this.context;

                if (context.enableTranslation === undefined) {
                    context.enableTranslation = this.configOptions.enableTranslation;
                }

                /* tenant variables */
                const configuration = this.getAllJhipsterConfig(this, true);
                mtUtils.tenantVariables(configuration.get('tenantName'), context, this);
                context.clientRootFolder = context.tenantClientRootFolder;
            }
        };

        return { ...super._initializing(), ...postInitializingSteps };
    }

    get prompting() {
        return {};
    }

    get configuring() {
        const preConfiguringSteps = {
            preJson() {
                mtUtils.validateTenant(this);
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
                this.context.changelogDate = this.options.tenantChangelogDate || this.config.get('tenantChangelogDate');
                this.updateEntityConfig(this.context.filename, 'changelogDate', this.context.changelogDate);
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
