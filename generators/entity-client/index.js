const EntityClientGenerator = require('generator-jhipster/generators/entity-client');

const EntityClientPatcher = require('./files');
const workarounds = require('../workarounds');

workarounds.fixGetAllJhipsterConfig(EntityClientGenerator);
workarounds.fixAddEntityToMenu(EntityClientGenerator);
workarounds.fixAddEntityToModule(EntityClientGenerator);

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        this.patcher = new EntityClientPatcher();
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
                this.patcher.patch(this);

                if (this.isTenant) {
                    // this.addEntityToMenu(this.entityStateName, this.enableTranslation, this.clientFramework, this.entityTranslationKeyMenu);
                    if (!this.configOptions.tenantMenu) {
                        // Removes this condition when creating moves to entity-tenant, this is to ensure this is executed only once.
                        this.configOptions.tenantMenu = true;
                    }

                    // tenant
                    this.patcher.tenantAngularTemplates(this);

                    return;
                }
                if (this.tenantAware) {
                    this.patcher.tenantAwareAngularTemplates(this);
                }
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
