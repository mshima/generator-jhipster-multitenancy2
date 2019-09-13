/* eslint-disable consistent-return */
const ServerGenerator = require('generator-jhipster/generators/server');

const Patcher = require('../patcher');
const mtUtils = require('../multitenancy-utils');
const GeneratorOverrides = require('../generator-extender');

module.exports = class extends GeneratorOverrides(ServerGenerator) {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.patcher = new Patcher(this);
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
            writeAdditionalFile() {
                this.packageFolder = this.config.get('packageFolder');
                // references to the various directories we'll be copying files to

                // template variables
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.config.get('tenantName'), this);
                this.changelogDate = this.options.tenantChangelogDate || this.config.get('tenantChangelogDate');

                this.patcher.patch();
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
