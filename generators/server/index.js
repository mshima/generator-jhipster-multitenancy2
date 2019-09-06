/* eslint-disable consistent-return */
const ServerGenerator = require('generator-jhipster/generators/server');

const ServerPatcher = require('./files');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.patcher = new ServerPatcher();
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
                this.changelogDate = this.config.get('tenantChangelogDate');

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
