/* eslint-disable consistent-return */
const EntityServerGenerator = require('generator-jhipster/generators/entity-server');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const mtUtils = require('../multitenancy-utils');
const files = require('./files');

module.exports = class extends EntityServerGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important
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
        const writing = super._writing();

        const setupCustomPhaseSteps = {
            // sets up all the variables we'll need for the templating
            setUpVariables() {
                this.SERVER_MAIN_SRC_DIR = jhipsterConstants.SERVER_MAIN_SRC_DIR;
            }
        };

        const writeCustomPhaseSteps = {
            // make the necessary server code changes
            customServerCode() {
                if (this.tenantAware) {
                    files.writeTenantAwareFiles.call(this);
                    mtUtils.processPartialTemplates(files.partials.entityTenantAwareTemplates(this), this);
                } else if (this.isTenant) {
                    files.writeTenantFiles.call(this);
                    mtUtils.processPartialTemplates(files.partials.tenantTemplates(this), this);
                }
            }
        };
        return Object.assign(writing, setupCustomPhaseSteps, writeCustomPhaseSteps);
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
