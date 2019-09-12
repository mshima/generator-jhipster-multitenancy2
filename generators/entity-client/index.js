const EntityClientGenerator = require('generator-jhipster/generators/entity-client');
const debug = require('debug')('jhipster:multitenancy2:entity:client');

const Patcher = require('../patcher');
const workarounds = require('../workarounds');
const GeneratorOverrides = require('../generator-overrides');

workarounds.fixGetAllJhipsterConfig(EntityClientGenerator);
workarounds.fixAddEntityToMenu(EntityClientGenerator);
workarounds.fixAddEntityToModule(EntityClientGenerator);

module.exports = class extends GeneratorOverrides(EntityClientGenerator) {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        // npm test fails probably because of errors of first run.
        // Add ignorePatchErrors until jhipster errors as fixed.
        this.patcher = new Patcher(this, { ignorePatchErrors: true });
        debug(`Initializing entity-client ${this.name}`);
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
            generateClientCode() {
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
