/* eslint-disable consistent-return */
const ClientGenerator = require('generator-jhipster/generators/client');

const ClientPatcher = require('./files');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.patcher = new ClientPatcher();
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
            patchFiles() {
                // template variables
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.config.get('tenantName'), this);
                this.patcher.patch(this);
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
