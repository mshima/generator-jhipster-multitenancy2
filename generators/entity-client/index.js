const debug = require('debug')('jhipster:multitenancy2:entity:client');

const Patcher = require('../patcher');

const jhipsterEnv = require('../jhipster-environment');
const EntityClientGenerator = require('../auto-extender')(jhipsterEnv.generator('entity-client'));

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        // npm test fails probably because of errors of first run.
        // Add ignorePatchErrors until jhipster errors as fixed.
        this.patcher = new Patcher(this);
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
