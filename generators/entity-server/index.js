/* eslint-disable consistent-return */
const EntityServerGenerator = require('generator-jhipster/generators/entity-server');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const debug = require('debug')('jhipster:multitenancy2:entity:server');

const TenantisedNeedle = require('./needle-api/needle-server-tenantised-entities-services');

const mtUtils = require('../multitenancy-utils');
const files = require('./files');

module.exports = class extends EntityServerGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important
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
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.config.get('tenantName'), this);

                const tenantisedNeedle = new TenantisedNeedle(this);
                if (this.tenantAware) {
                    files.writeTenantAwareFiles.call(this);
                    mtUtils.processPartialTemplates(files.partials.entityTenantAwareTemplates(this), this);

                    tenantisedNeedle.addEntityToTenantAspect(this, this.name);
                } else if (this.isTenant) {
                    files.writeTenantFiles.call(this);
                    mtUtils.processPartialTemplates(files.partials.tenantTemplates(this), this);

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
