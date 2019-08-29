/* eslint-disable consistent-return */
const ServerGenerator = require('generator-jhipster/generators/server');
const files = require('./files');
const mtUtils = require('../multitenancy-utils');

module.exports = class extends ServerGenerator {
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
            // make the necessary server code changes
            writeAdditionalFile() {
                files.writeFiles.call(this);
                mtUtils.processPartialTemplates(files.server.templates(this), this);
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
