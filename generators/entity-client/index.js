const EntityClientGenerator = require('generator-jhipster/generators/entity-client');
const debug = require('debug')('jhipster:multitenancy2:entity:client');

const Patcher = require('../patcher');
const workarounds = require('../workarounds');

workarounds.fixGetAllJhipsterConfig(EntityClientGenerator);
workarounds.fixAddEntityToMenu(EntityClientGenerator);
workarounds.fixAddEntityToModule(EntityClientGenerator);
workarounds.addReturnRewriteReplace(EntityClientGenerator);

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

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
