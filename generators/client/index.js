/* eslint-disable consistent-return */
const ClientGenerator = require('generator-jhipster/generators/client');
const debug = require('debug')('jhipster:multitenancy2:entity');

const Patcher = require('../patcher');
const mtUtils = require('../multitenancy-utils');

const workarounds = require('../workarounds');

workarounds.addReturnRewriteReplace(ClientGenerator);

module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.option('tenant-root-folder', {
            desc: 'Set tenant root folder',
            type: String,
            default: '../admin'
        });

        debug('Initializing client');
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
