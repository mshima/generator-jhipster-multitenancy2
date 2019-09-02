/* eslint-disable consistent-return */
const EntityClientGenerator = require('generator-jhipster/generators/entity-client');

const mtUtils = require('../multitenancy-utils');
const files = require('./files');
const workarounds = require('../workarounds');

workarounds.fixGetAllJhipsterConfig(EntityClientGenerator);
workarounds.fixAddEntityToMenu(EntityClientGenerator);
workarounds.fixAddEntityToModule(EntityClientGenerator);

module.exports = class extends EntityClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important
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
                mtUtils.processPartialTemplates(files.angular.angularTemplates(this), this);
                if (this.isTenant) {
                    // this.addEntityToMenu(this.entityStateName, this.enableTranslation, this.clientFramework, this.entityTranslationKeyMenu);
                    if (!this.configOptions.tenantMenu) {
                        // Removes this condition when creating moves to entity-tenant, this is to ensure this is executed only once.
                        this.configOptions.tenantMenu = true;
                    }

                    // tenant
                    mtUtils.processPartialTemplates(files.angular.tenantAngularTemplates(this), this);

                    // tests
                    mtUtils.processPartialTemplates(files.angular.angularTestTemplates(this), this);

                    // e2e test
                    if (this.testFrameworks.indexOf('protractor') !== -1) {
                        mtUtils.processPartialTemplates(files.angular.protractor(this), this);
                    }

                    files.writeFiles.call(this);

                    return;
                }
                if (this.tenantAware) {
                    mtUtils.processPartialTemplates(files.angular.tenantAwareAngularTemplates(this), this);
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
