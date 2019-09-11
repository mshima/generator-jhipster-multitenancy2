/* eslint-disable consistent-return */
const EntityServerGenerator = require('generator-jhipster/generators/entity-server');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const debug = require('debug')('jhipster:multitenancy2:entity:server');

const TenantisedNeedle = require('./needle-api/needle-server-tenantised-entities-services');

const mtUtils = require('../multitenancy-utils');
const EntityServerPatcher = require('./files');

const workarounds = require('../workarounds');

workarounds.addReturnRewriteReplace(EntityServerGenerator);

module.exports = class extends EntityServerGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important
        // Fix {Tenant}Resource.java setting ENTITY_NAME as 'admin{Tenant}'
        this.skipUiGrouping = true;

        this.patcher = new EntityServerPatcher(this);
        debug(`Initializing entity-server ${this.name}`);
    }

    get initializing() {
        return super._initializing();
    }

    get prompting() {
        return super._prompting();
    }

    get configuring() {
        return super._configuring();
    }

    get default() {
        return super._default();
    }

    get writing() {
        const postWritingSteps = {
            // sets up all the variables we'll need for the templating
            setUpVariables() {
                this.SERVER_MAIN_SRC_DIR = jhipsterConstants.SERVER_MAIN_SRC_DIR;
            },
            // make the necessary server code changes
            customServerCode() {
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.config.get('tenantName'), this, this);

                const tenantisedNeedle = new TenantisedNeedle(this);
                if (this.tenantAware) {
                    this.patcher.entityTenantAwareTemplates(this);

                    tenantisedNeedle.addEntityToTenantAspect(this, this.name);
                } else if (this.isTenant) {
                    this.patcher.tenantTemplates(this);

                    debug('Adding already tenantised entities');
                    if (this.configOptions.tenantAwareEntities) {
                        this.configOptions.tenantAwareEntities.forEach(tenantAwareEntity => {
                            debug(`Adding entity ${tenantAwareEntity}`);
                            tenantisedNeedle.addEntityToTenantAspect(this, tenantAwareEntity);
                        });
                    }
                }
            }
        };
        return { ...super._writing(), ...postWritingSteps };
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
