/* eslint-disable consistent-return */
const ClientGenerator = require('generator-jhipster/generators/client');
const files = require('./files');

const mtUtils = require('../multitenancy-utils');

module.exports = class extends ClientGenerator {
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
        const myCustomPhaseSteps = {
            // sets up all the variables we'll need for the templating
            setUpVariables() {
                // template variables
                mtUtils.tenantVariables.call(this, this.options.tenantName || this.config.get('tenantName'), this);
            },
            writeAdditionalFile() {
                files.writeFiles.call(this);
            },
            // make the necessary client code changes and adds the tenant UI
            generateClientCode() {
                // Rewrites to existing files
                mtUtils.processPartialTemplates(files.angular.templates(this), this);
            }
        };
        return Object.assign(writing, myCustomPhaseSteps);
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
