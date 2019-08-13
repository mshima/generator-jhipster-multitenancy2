const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const mtUtils = require('../multitenancy-utils');

const angularTemplates = [
    'entity.component.html'
];

const tenantAwareAngularTemplates = [
    'entity-detail.component.html',
    'entity-update.component.html',
    'entity-update.component.ts'
];

const angularTestTemplates = [
    '_tenant-management-delete-dialog.component.spec.ts',
    '_tenant-management-detail.component.spec.ts',
    '_tenant-management-update.component.spec.ts',
    '_tenant-management.component.spec.ts'
];

const angularProtractorTemplates = [
    '_tenant-management.spec.ts'
];

module.exports = {
    writeFiles,
    angular: {
        angularTemplates(context) {
            return mtUtils.requireTemplates('./entity-client/partials/angular/', angularTemplates, context);
        },
        tenantAwareAngularTemplates(context) {
            return mtUtils.requireTemplates('./entity-client/partials/angular/', tenantAwareAngularTemplates, context);
        },
        angularTestTemplates(context) {
            return mtUtils.requireTemplates('./entity-client/partials/angular/test/', angularTestTemplates, context);
        },
        protractor(context) {
            return mtUtils.requireTemplates('./entity-client/partials/angular/protractor/', angularProtractorTemplates, context);
        }
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
                        renameTo: generator =>
                            `e2e/admin/${this.tenantNameLowerFirst}-management/${this.tenantNameLowerFirst}-management-tenant.spec.ts`
                    }
                ]
            }
        ]
    };

    // parse the templates and write files to the appropriate locations
    this.writeFilesToDisk(files, this, false);
}
