const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const mtUtils = require('../multitenancy-utils');

const angularTemplates = [
    'entity.component.html',
    'entity-detail.component.html',
    'entity-update.component.html',
    'entity-update.component.ts',
    'navbar.component.html',
] 

const angularTestTemplates = [
    '_tenant-management.spec.ts',
] 

module.exports = {
    writeFiles,
    angular: {
        templates: function (context) {
            return mtUtils.requireTemplates('./entity-client/partials/angular/', angularTemplates, context);
        },
        protractor: function (context) {
            return mtUtils.requireTemplates('./entity-client/partials/angular/protractor/', angularTestTemplates, context);
        },
    }
};

function writeFiles() {
    // configs for the template files
    const files = {
        tests: [
            {
                condition: generator => generator.protractorTests,
                path: jhipsterConstants.CLIENT_TEST_SRC_DIR,
                templates: [
                    {
                        file: 'e2e/admin/_tenant-management.spec.ts',
                        renameTo: generator => `e2e/admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-tenant.spec.ts`
                    }
                ]
            },
        ]
    };

    // parse the templates and write files to the appropriate locations
    this.writeFilesToDisk(files, this, false);
}